import { useDialog } from "@/components/shared/Dialogs";
import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Save, Upload, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileIcon } from "../FileIcon";
import { formatFileSize } from "@/lib/file.utils";

interface useUploadDialogProps {
  uploadFiles?: (files: File[]) => void;
  isUploadPending?: boolean;
}

export const useUploadDialog = ({
  uploadFiles,
  isUploadPending,
}: useUploadDialogProps) => {
  interface UploadedFile {
    id: string;
    file: File;
    name: string;
    size: string;
    type: string;
  }

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const {
    DialogFragment: uploadDialog,
    openDialog: openUploadDialog,
    closeDialog: closeUploadDialog,
  } = useDialog({
    title: <div className="leading-normal">Upload Files</div>,
    description:
      "Drag and drop files here or click to browse. You can upload multiple files at once.",
    children: (
      <div className="space-y-4 px-2">
        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragOver ? "Drop files here" : "Drag & Drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files
          </p>
          <Button variant="secondary" size="sm">
            Browse Files
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Uploaded Files ({files.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFiles}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {files.map((file) => {
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                  >
                    <FileIcon type={file.type} size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.size}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-destructive hover:text-destructive flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => closeUploadDialog()}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              uploadFiles?.(files.map((file) => file.file));
              closeUploadDialog();
            }}
            disabled={files.length === 0}
          >
            <UploadCloud />
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[700px]",
  });

  return {
    uploadDialog,
    openUploadDialog,
    closeUploadDialog,
  };
};
