import React from "react";
import Image from "next/image";
import { api } from "@/api";
import axios from "@/api/axios";
import { cn } from "@/lib/utils";

export interface UseServerImagesProps {
  ids: (number | string | undefined | null)[];
  fallbacks?: (string | React.ReactNode | undefined)[];
  size?: { width?: number; height?: number };
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
  enabled?: boolean;
}

// Global memory cache of loaded/preloaded image URLs mimicking Expo Image session caching
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
}: UseServerImagesProps) => {
  // Synchronously compute direct URLs without useQuery / useQueries
  const rawUrls = React.useMemo(() => {
    return ids.map((id) =>
      enabled && id !== undefined && id !== null && !isNaN(Number(id)) && Number(id) > 0
        ? api.upload.getUploadById(Number(id))
        : undefined
    );
  }, [ids, enabled]);

  // Track re-renders when global background preloads complete
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
    return rawUrls.some((url) => url && !loadedUrls.has(url) && !errorUrls.has(url));
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

      // 1. If upload URL exists and has not permanently failed loading
      if (upload && !isError) {
        return (
          <div
            key={index}
            className={cn(wrapperClassName, "flex items-center justify-center overflow-hidden relative")}
            style={{
              width: size?.width ? `${size.width}px` : "100%",
              height: size?.height ? `${size.height}px` : "100%",
            }}
          >
            {!isLoaded && (
              <div
                className={cn("animate-pulse bg-gray-300 dark:bg-gray-700 absolute inset-0", className)}
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
                  className
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
                  className
                )}
              />
            )}
          </div>
        );
      }

      // 2. Fallback React Element
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, { key: index });
      }

      // 3. Fallback string (URL or avatar character)
      if (typeof fallback === "string") {
        if (fallback.startsWith("http") || fallback.startsWith("/") || fallback.startsWith("blob:")) {
          return (
            <div
              key={index}
              className={cn(wrapperClassName, "flex items-center justify-center overflow-hidden relative")}
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
              fallbackClassName
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
      return (
        <div
          key={index}
          className={cn("animate-pulse bg-gray-300 dark:bg-gray-700", className)}
          style={{
            width: size?.width ? `${size.width}px` : "100%",
            height: size?.height ? `${size.height}px` : "100%",
          }}
        />
      );
    });
  }, [ids, rawUrls, uploads, fallbacks, size, className, wrapperClassName, fallbackClassName, updateCount]);

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
