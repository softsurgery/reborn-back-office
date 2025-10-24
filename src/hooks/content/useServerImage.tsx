import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { cn } from "@/lib/utils";

interface UseServerImageProps {
  id?: number;
  size: { width: number; height: number };
  fallback?: string | React.ReactNode;
  enabled?: boolean;
  className?: string;
}

interface UseServerImageReturn {
  upload: any | null;
  isPending: boolean;
  jsx: JSX.Element;
}

export const useServerImage = ({
  id,
  size,
  fallback,
  enabled = true,
  className,
}: UseServerImageProps): UseServerImageReturn => {
  const { data: uploadResp, isPending } = useQuery({
    queryKey: ["server-image", id],
    queryFn: async () => api.upload.getUploadById(id!),
    enabled: !!id && enabled,
    staleTime: Infinity,
    retry: false,
  });

  const upload = useMemo(() => uploadResp ?? null, [uploadResp]);

  const jsx = useMemo(() => {
    // 1️⃣ Image serveur disponible
    if (upload && !isPending) {
      return (
        <img
          src={upload}
          alt="server"
          width={size.width}
          height={size.height}
          className={cn("rounded-full object-cover", className)}
          onError={(e) => {
            if (typeof fallback === "string") {
              e.currentTarget.src = fallback;
            }
          }}
        />
      );
    }

    // 2️⃣ Chargement
    if (isPending && id) {
      return (
        <div
          className={cn("animate-pulse bg-gray-300 rounded-full", className)}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
          }}
        />
      );
    }

    // 3️⃣ Fallback React Element
    if (React.isValidElement(fallback)) {
      return fallback;
    }

    // 4️⃣ Fallback texte → première lettre
    if (typeof fallback === "string") {
      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-bold",
            className
          )}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            fontSize: `${size.width / 2.5}px`,
          }}
        >
          {fallback.charAt(0).toUpperCase()}
        </div>
      );
    }

    // 5️⃣ Par défaut → squelette
    return (
      <div
        className={cn("animate-pulse bg-gray-300 rounded-full", className)}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      />
    );
  }, [upload, isPending, fallback, size, className, id]);

  // ✅ Retour correct du hook
  return { upload, isPending, jsx };
};
