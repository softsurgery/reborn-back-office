import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Download,
  X,
  Eye,
  Plus,
  EyeOff,
  PackageOpen,
  File,
} from "lucide-react";
import { useRef } from "react";
import { downloadFile, formatFileSize } from "@/lib/file.utils";
import { FileIcon } from "./FileIcon";
import { useResourceStore } from "@/hooks/stores/useResourceStore";

interface ResourceFormProps {
  className?: string;
}

export const ResourceForm = ({ className }: ResourceFormProps) => {
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
      <Button onClick={handleClick} variant="outline">
        <File />
        Add File(s)
      </Button>

      <ul className="flex flex-col flex-1 gap-2 overflow-auto p-2 my-3 border rounded-lg">
        {files.length > 0 &&
          files.map((privFile, index) => (
            <li
              key={`${privFile.file.name}-${index}`}
              className="flex items-center p-2 border rounded"
            >
              {/* Icon */}
              <div className="w-1/12 flex-shrink-0">
                <FileIcon type={privFile.file.type} size={24} />
              </div>

              {/* Name & Size */}
              <div className="w-8/12 px-2 overflow-hidden">
                <p className="truncate">{privFile.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(privFile.file.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="w-3/12 flex justify-end gap-4">
                <Button
                  size="icon"
                  variant="link"
                  className="text-foreground hover:text-accent"
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
                  size="icon"
                  variant="link"
                  className="text-foreground hover:text-secondary"
                  onClick={() => downloadFile(privFile.file)}
                >
                  <Download />
                </Button>
                <Button
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
            No Results <PackageOpen />
          </div>
        )}
      </ul>

      <div className="flex items-center justify-end gap-2">
        <Button
          onClick={() => {
            console.log(files);
          }}
        >
          <Plus /> {files.length == 1 ? "Add Resource" : "Add Resources"}
        </Button>
        <Button variant="outline" onClick={reset}>
          Clear
        </Button>
      </div>
    </div>
  );
};
