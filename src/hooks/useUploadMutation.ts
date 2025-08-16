import { api } from "@/api";
import { useMutation } from "@tanstack/react-query";

interface useUploadMutationProps {
  temporary?: boolean;
  onProgress?: (percent: number) => void;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

export const useUploadMutation = ({
  temporary = true,
  onProgress,
  onSuccess,
  onError,
}: useUploadMutationProps) => {
  const { mutate: uploadFiles, isPending: isUploadPending } = useMutation({
    mutationFn: async ({
      files,
      onProgress,
    }: {
      files: File[];
      onProgress?: (percent: number) => void;
    }) => {
      return api.upload.uploadFiles(files, onProgress, temporary);
    },
    onSuccess,
    onError,
  });

  return {
    uploadFiles,
    isUploadPending,
  };
};
