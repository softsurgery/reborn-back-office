import React from "react";
import { useServerImages } from "@/hooks/content/useServerImages";

interface UseUploadProps {
  id?: number | undefined;
  enabled?: boolean;
}

export const useUpload = ({ id, enabled = true }: UseUploadProps) => {
  const { uploads, isPending: isUploadPending } = useServerImages({
    ids: [id],
    enabled: !!id && enabled,
  });

  const upload = React.useMemo(() => uploads[0] ?? null, [uploads]);

  return { upload, isUploadPending };
};
