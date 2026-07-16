import React from "react";
import { useServerImages } from "@/hooks/content/useServerImages";

interface UploadResult {
  id: number;
  url: string;
  name: string;
  image: null;
  progress: number;
}

export const useUploads = (ids?: (number | undefined)[]) => {
  const { uploads: urls, isPending } = useServerImages({
    ids: ids ?? [],
    enabled: !!ids && ids.length > 0,
  });

  const uploads = React.useMemo(() => {
    return (ids ?? [])
      .map((id, index) => {
        const url = urls[index];
        if (!id || !url) return null;
        return {
          id: Number(id),
          url,
          name: `image-${id}.png`,
          image: null,
          progress: 100,
        };
      })
      .filter((u): u is UploadResult => Boolean(u));
  }, [ids, urls]);

  return { uploads, isPending };
};
