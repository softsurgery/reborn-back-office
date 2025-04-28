import { useSheet } from "@/components/Common/Sheets";
import { Eye } from "lucide-react";

interface ResourcePreviewSheet {
  representation?: string;
}

export const useResourcePreviewSheet = ({
  representation,
}: ResourcePreviewSheet) => {
  const {
    SheetFragment: previewResourceSheet,
    openSheet: openPreviewResourceSheet,
    closeSheet: closePreviewResourceSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Eye />
        Preview
      </div>
    ),
    description: `This is a preview window for ${representation}`,
    children: <div></div>,
    className: "min-w-[75vw]",
  });

  return {
    previewResourceSheet,
    openPreviewResourceSheet,
    closePreviewResourceSheet,
  };
};
