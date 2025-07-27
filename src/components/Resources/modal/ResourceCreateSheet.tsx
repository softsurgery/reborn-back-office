import { useSheet } from "@/components/shared/Sheets";
import { PackagePlus } from "lucide-react";
import { ResourceForm } from "../ResourceForm";

interface ResourceCreateSheet {
  uploadFiles?: () => void;
  isUploadingPending?: boolean;
}

export const useResourceCreateSheet = ({
  uploadFiles,
  isUploadingPending,
}: ResourceCreateSheet) => {
  const {
    SheetFragment: createResourceSheet,
    openSheet: openCreateResourceSheet,
    closeSheet: closeCreateResourceSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <PackagePlus />
        Add Resource
      </div>
    ),
    description: `This is a create window for resources`,
    children: (
      <ResourceForm
        className="my-2"
        uploadFiles={uploadFiles}
        isUploadingPending={isUploadingPending}
      />
    ),
    className: "min-w-[30vw]",
  });

  return {
    createResourceSheet,
    openCreateResourceSheet,
    closeCreateResourceSheet,
  };
};
