import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

interface UseUploadProps {
  id?: number;
  enabled?: boolean;
}

export const useUpload = ({ id, enabled = true }: UseUploadProps) => {
  const { data: uploadResp, isPending: isUploadPending } = useQuery({
    queryKey: ["upload", id],
    queryFn: async () => api.upload.getUploadById(id!),
    enabled: !!id && enabled,
    staleTime: Infinity,
    retry: false,
  });

  const upload = React.useMemo(() => uploadResp ?? null, [uploadResp]);

  return { upload, isUploadPending };
};
