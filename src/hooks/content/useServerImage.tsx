import React, { useMemo } from "react";
import { useServerImages } from "@/hooks/content/useServerImages";
import { cn } from "@/lib/utils";

interface UseServerImageProps {
  id?: number | undefined;
  size?: { width?: number; height?: number };
  fallback?: string | React.ReactNode;
  enabled?: boolean;
  className?: string;
  wrapperClassName?: string;
  fallbackClassName?: string;
}

interface UseServerImageReturn {
  upload: string | null;
  isPending: boolean;
  jsx: JSX.Element;
}

export const useServerImage = ({
  id,
  size,
  fallback,
  enabled = true,
  className,
  wrapperClassName,
  fallbackClassName,
}: UseServerImageProps): UseServerImageReturn => {
  const { uploads, isPending, jsxArray } = useServerImages({
    ids: [id],
    fallbacks: [fallback],
    size,
    className: cn("rounded-full", className),
    wrapperClassName,
    fallbackClassName,
    enabled,
  });

  const upload = useMemo(
    () => (uploads[0] ? (uploads[0] as string) : null),
    [uploads],
  );
  const jsx = useMemo(
    () => (jsxArray[0] ? (jsxArray[0] as JSX.Element) : <></>),
    [jsxArray],
  );

  return { upload, isPending, jsx };
};
