import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, X, Eye, Plus, EyeOff, PackageOpen } from "lucide-react";
import { useRef } from "react";
import { downloadFile, formatFileSize } from "@/lib/file.utils";
import { FileIcon } from "./FileIcon";
import { useResourceStore } from "@/hooks/stores/useResourceStore";

interface ResourceFormProps {
  className?: string;
  uploadFiles?: () => void;
  isUploadingPending?: boolean;
}

export const ResourceForm = ({
  className,
  uploadFiles,
  isUploadingPending,
}: ResourceFormProps) => {
  const { files, addFile, removeFile, setFiles, reset } = useResourceStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach((file) =>
        addFile({ file, isPublic: false })
      );
      event.target.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const toggleFileVisibility = (index: number, value: boolean) => {
    const updatedFiles = [...files];
    updatedFiles[index] = {
      ...updatedFiles[index],
      isPublic: value,
    };
    setFiles(updatedFiles);
  };

  return (
    <div
      className={cn("flex flex-col flex-1 gap-2 overflow-hidden", className)}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      {/* File List */}
      <ul className="flex flex-col flex-1 gap-2 overflow-auto p-4 border rounded-lg">
        {files.length > 0 &&
          files.map((privFile, index) => (
            <li
              key={`${privFile.file.name}-${index}`}
              className={cn(
                "flex items-center p-2 border rounded",
                isUploadingPending && "opacity-50"
              )}
            >
              {/* Icon */}
              <div className="w-1/12 flex-shrink-0">
                <FileIcon type={privFile.file.type} size={24} />
              </div>

              {/* Name & Size */}
              <div className="w-8/12 px-2 overflow-hidden">
                <p className="truncate font-bold">{privFile.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(privFile.file.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="w-3/12 flex justify-end">
                <Button
                  disabled={isUploadingPending}
                  size="icon"
                  variant="link"
                  className="text-foreground hover:text-destructive"
                  onClick={() =>
                    toggleFileVisibility(index, !privFile.isPublic)
                  }
                >
                  {privFile.isPublic ? (
                    <Eye />
                  ) : (
                    <EyeOff className="text-destructive" />
                  )}
                </Button>
                <Button
                  disabled={isUploadingPending}
                  size="icon"
                  variant="link"
                  className="text-foreground hover:text-secondary"
                  onClick={() => downloadFile(privFile.file)}
                >
                  <Download />
                </Button>
                <Button
                  disabled={isUploadingPending}
                  size="icon"
                  variant="link"
                  className="text-foreground hover:text-destructive"
                  onClick={() => removeFile(privFile)}
                >
                  <X />
                </Button>
              </div>
            </li>
          ))}
        {files.length === 0 && (
          <div className="flex items-center justify-center gap-2 font-bold h-full">
            No Files <PackageOpen />
          </div>
        )}
      </ul>
      {/* Add Resources */}
      <Button
        onClick={handleClick}
        variant="outline"
        className="my-2"
        disabled={isUploadingPending}
      >
        <Plus />
      </Button>
      {/* Form Controls */}
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="default"
          disabled={files.length === 0 || isUploadingPending}
          onClick={uploadFiles}
          className="w-1/2"
        >
          <Plus /> {files.length == 1 ? "Add Resource" : "Add Resources"}
        </Button>
        <Button
          variant="outline"
          disabled={files.length === 0 || isUploadingPending}
          onClick={reset}
          className="w-1/2"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
