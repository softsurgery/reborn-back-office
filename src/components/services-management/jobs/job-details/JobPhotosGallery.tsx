import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { ImageCarousel } from "@/components/shared/ImageCarousel";
import { useServerImages } from "@/hooks/content/useServerImages";
import { ResponseJobDto } from "@/types";

interface JobPhotosGalleryProps {
  job: ResponseJobDto | any | null;
  uploads?: string[];
}

export const JobPhotosGallery = ({ job, uploads = [] }: JobPhotosGalleryProps) => {
  const activeUploads = React.useMemo(() => {
    if (Array.isArray(uploads) && uploads.length > 0)
      return uploads.map(String);
    if (job?.uploads && Array.isArray(job.uploads)) {
      return [...job.uploads]
        .sort((a: any, b: any) => a.order - b.order)
        .map((u: any) => String(u.uploadId));
    }
    return [];
  }, [uploads, job?.uploads]);

  const { uploads: imageUploads, isPending: isImagesPending } = useServerImages(
    {
      ids: activeUploads.map((id) => Number(id)),
      enabled: activeUploads.length > 0,
    },
  );

  const validImages = React.useMemo(() => {
    return imageUploads
      .map((url, idx) => ({
        url: url || "",
        id: activeUploads[idx],
        isPending: isImagesPending,
        isError: !url && !isImagesPending,
      }))
      .filter((img) => !img.isError && Boolean(img.url));
  }, [imageUploads, activeUploads, isImagesPending]);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-extrabold flex items-center gap-2 text-foreground">
          <ImageIcon className="w-5 h-5 text-primary" />
          Job Photos ({activeUploads.length})
        </h2>
      </div>

      <ImageCarousel
        images={validImages}
        isLoading={isImagesPending && activeUploads.length > 0}
        heightClassName="h-[320px] md:h-[480px]"
        emptyTitle="No photos attached to this job"
        emptyDescription="The employer has not uploaded any pictures for this listing yet."
      />
    </div>
  );
};
