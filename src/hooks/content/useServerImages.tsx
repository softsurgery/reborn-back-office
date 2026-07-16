import React from "react";
import Image from "next/image";
import { api } from "@/api";
import axios from "@/api/axios";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface useServerImagesProps {
  ids: number[];
  fallbacks?: (string | React.ReactNode | undefined)[];
  size?: { width?: number; height?: number };
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
  enabled?: boolean;
}

// Global memory cache of loaded/preloaded image URLs
const loadedUrls = new Set<string>();
const errorUrls = new Set<string>();
const loadingCallbacks = new Map<string, Set<() => void>>();
const objectUrlCache = new Map<string, string>();

const triggerCallbacks = (url: string) => {
  const callbacks = loadingCallbacks.get(url);
  if (callbacks) {
    callbacks.forEach((cb) => cb());
    loadingCallbacks.delete(url);
  }
};

export const preloadImage = (url: string) => {
  if (typeof window === "undefined" || !url) return;
  if (loadedUrls.has(url) || errorUrls.has(url)) return;

  if (!loadingCallbacks.has(url)) {
    loadingCallbacks.set(url, new Set());
    axios
      .get(url, { responseType: "blob" })
      .then((response) => {
        try {
          const objectUrl = URL.createObjectURL(response.data);
          objectUrlCache.set(url, objectUrl);
          loadedUrls.add(url);
          triggerCallbacks(url);
        } catch (err) {
          console.error("Failed to create blob URL:", url, err);
          errorUrls.add(url);
          triggerCallbacks(url);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch image via axios:", url, err);
        errorUrls.add(url);
        triggerCallbacks(url);
      });
  }
};

export const useServerImages = ({
  ids,
  fallbacks = [],
  size,
  className,
  wrapperClassName,
  fallbackClassName,
  enabled = true,
}: useServerImagesProps) => {
  const rawUrls = React.useMemo(() => {
    return ids.map((id) =>
      enabled &&
      id !== undefined &&
      id !== null &&
      !isNaN(Number(id)) &&
      Number(id) > 0
        ? api.upload.getUploadById(Number(id))
        : undefined,
    );
  }, [ids, enabled]);

  const [updateCount, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const uploads = React.useMemo(() => {
    void updateCount;
    return rawUrls.map((url) => (url ? objectUrlCache.get(url) : undefined));
  }, [rawUrls, updateCount]);

  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let mounted = true;
    const unsubscribeFns: (() => void)[] = [];

    rawUrls.forEach((url) => {
      if (!url || loadedUrls.has(url) || errorUrls.has(url)) return;

      preloadImage(url);

      const callbacks = loadingCallbacks.get(url);
      if (callbacks) {
        const callback = () => {
          if (mounted) forceUpdate();
        };
        callbacks.add(callback);
        unsubscribeFns.push(() => callbacks.delete(callback));
      }
    });

    return () => {
      mounted = false;
      unsubscribeFns.forEach((unsub) => unsub());
    };
  }, [rawUrls, enabled]);

  const isPending = React.useMemo(() => {
    void updateCount;
    return rawUrls.some(
      (url) => url && !loadedUrls.has(url) && !errorUrls.has(url),
    );
  }, [rawUrls, updateCount]);

  const jsxArray = React.useMemo(() => {
    void updateCount;
    return ids.map((id, index) => {
      const numericId =
        id !== undefined && id !== null && !isNaN(Number(id)) && Number(id) > 0
          ? Number(id)
          : undefined;
      const rawUrl = numericId !== undefined ? rawUrls[index] : undefined;
      const upload = numericId !== undefined ? uploads[index] : undefined;
      const fallback = fallbacks[index];
      const isLoaded = rawUrl ? loadedUrls.has(rawUrl) : false;
      const isError = rawUrl ? errorUrls.has(rawUrl) : false;

      // 1. Server Image Upload (with Skeleton while loading)
      // Why: A valid image upload URL exists for this ID and has not permanently failed loading.
      // When: The ID is valid (> 0), the API returned an upload object, and onError hasn't triggered. While the image is being fetched/decoded (!isLoaded), we show <Skeleton /> directly as a temporary placeholder inside the wrapper. Once loaded, the <Image /> transitions smoothly to opacity-100.
      if (upload && !isError) {
        return (
          <div
            key={index}
            className={cn(
              wrapperClassName,
              "flex items-center justify-center overflow-hidden relative",
            )}
            style={{
              width: size?.width ? `${size.width}px` : "100%",
              height: size?.height ? `${size.height}px` : "100%",
            }}
          >
            {!isLoaded && (
              <Skeleton
                className={cn("absolute inset-0", className)}
                style={{
                  width: size?.width,
                  height: size?.height,
                }}
              />
            )}
            {size?.width && size?.height ? (
              <Image
                src={upload}
                alt="server-upload"
                width={size.width}
                height={size.height}
                unoptimized
                onLoad={() => {
                  if (rawUrl && !loadedUrls.has(rawUrl)) {
                    loadedUrls.add(rawUrl);
                    forceUpdate();
                  }
                }}
                onError={() => {
                  if (rawUrl) {
                    errorUrls.add(rawUrl);
                    forceUpdate();
                  }
                }}
                className={cn(
                  "object-cover transition-opacity duration-200",
                  isLoaded ? "opacity-100" : "opacity-0",
                  className,
                )}
              />
            ) : (
              <Image
                src={upload}
                alt="server-upload"
                fill
                unoptimized
                onLoad={() => {
                  if (rawUrl && !loadedUrls.has(rawUrl)) {
                    loadedUrls.add(rawUrl);
                    forceUpdate();
                  }
                }}
                onError={() => {
                  if (rawUrl) {
                    errorUrls.add(rawUrl);
                    forceUpdate();
                  }
                }}
                className={cn(
                  "object-cover transition-opacity duration-200",
                  isLoaded ? "opacity-100" : "opacity-0",
                  className,
                )}
              />
            )}
          </div>
        );
      }

      // 2. Custom React Element Fallback
      // Why: The caller provided a custom React component/element (e.g., custom badge, icon, or specialized placeholder) to render when no server image is available.
      // When: The server image ID is missing, invalid, or failed to load (isError), and the corresponding fallback in fallbacks[index] is a valid React element (ReactNode).
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, { key: index });
      }

      // 3. String Fallback (Image URL or Avatar Initials)
      // Why: The caller provided a string fallback, which could either be an external/static image URL or text representing an entity name/initials.
      // When: The server image ID is missing, invalid, or failed to load, and fallbacks[index] is a string.
      //       - If the string starts with 'http', '/', or 'blob:', it is rendered as a fallback <Image />.
      //       - Otherwise, it is rendered as an avatar badge showing the uppercase first character.
      if (typeof fallback === "string") {
        if (
          fallback.startsWith("http") ||
          fallback.startsWith("/") ||
          fallback.startsWith("blob:")
        ) {
          return (
            <div
              key={index}
              className={cn(
                wrapperClassName,
                "flex items-center justify-center overflow-hidden relative",
              )}
              style={{
                width: size?.width ? `${size.width}px` : "100%",
                height: size?.height ? `${size.height}px` : "100%",
              }}
            >
              {size?.width && size?.height ? (
                <Image
                  src={fallback}
                  alt="fallback"
                  width={size.width}
                  height={size.height}
                  unoptimized
                  className={cn("object-cover w-full h-full", className)}
                />
              ) : (
                <Image
                  src={fallback}
                  alt="fallback"
                  fill
                  unoptimized
                  className={cn("object-cover w-full h-full", className)}
                />
              )}
            </div>
          );
        }

        return (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold",
              className,
              fallbackClassName,
            )}
            style={{
              width: size?.width ? `${size.width}px` : "100%",
              height: size?.height ? `${size.height}px` : "100%",
            }}
          >
            {fallback.charAt(0).toUpperCase()}
          </div>
        );
      }

      // 4. Default Skeleton
      // Why: Neither a valid server image nor any custom fallback (ReactNode or string) was provided for this item, so we display a standard loading/placeholder skeleton.
      // When: All previous branches fall through — e.g., when the ID is missing/invalid or the image is currently being fetched without a fallback configured. We use <Skeleton /> directly instead of a manual div mimicking a skeleton to maintain consistent styling across the app.
      return (
        <Skeleton
          key={index}
          className={className}
          style={{
            width: size?.width ? `${size.width}px` : "100%",
            height: size?.height ? `${size.height}px` : "100%",
          }}
        />
      );
    });
  }, [
    ids,
    rawUrls,
    uploads,
    fallbacks,
    size,
    className,
    wrapperClassName,
    fallbackClassName,
    updateCount,
  ]);

  return {
    uploads,
    isPending,
    jsxArray,
    refetch: () => {
      rawUrls.forEach((url) => {
        if (url) {
          const existingBlob = objectUrlCache.get(url);
          if (existingBlob) {
            URL.revokeObjectURL(existingBlob);
            objectUrlCache.delete(url);
          }
          loadedUrls.delete(url);
          errorUrls.delete(url);
          preloadImage(url);
        }
      });
      forceUpdate();
    },
  };
};
