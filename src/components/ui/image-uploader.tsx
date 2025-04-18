import React from "react";
import { useDropzone } from "react-dropzone";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface ImageUploaderProps {
  className?: string;
  value?: File;
  onChange?: (value: File | null) => void;
  width?: `${number}`;
  height?: `${number}`;
  alt?: string;
  icon?: React.ReactNode;
  t?: Function;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  className,
  value,
  onChange,
  width,
  height,
  alt,
  icon,
  t,
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>();
  const { value: debouncedPreview, loading: previewing } = useDebounce<
    string | ArrayBuffer | null | undefined
  >(preview, 500);

  const createPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  React.useEffect(() => {
    if (value) {
      createPreview(value);
    }
  }, [value]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        createPreview(file);
        onChange?.(file);
      } else {
        onChange?.(null);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 1000000,
    accept: { "image/*": [] },
  });

  return (
    <div className="flex flex-row gap-2 mt-4">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col  rounded-lg cursor-pointer gap-2",
          className
        )}
      >
        <Avatar className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44">
          <AvatarImage
            src={(debouncedPreview as string) || undefined}
            alt={alt}
          />
          <AvatarFallback>{alt}</AvatarFallback>
        </Avatar>
        <div className="mx-auto mt-2">
          <Input {...getInputProps()} type="file" />
          <Label className="text-xs sm:text-sm opacity-70 italic">
            {isDragActive
              ? t
                ? t("dropzone.drop_here")
                : "Drop here"
              : t
              ? t("dropzone.select_file")
              : "Click to select..."}
          </Label>
        </div>
      </div>
    </div>
  );
};
