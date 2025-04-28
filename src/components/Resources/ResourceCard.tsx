import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Download, Eye, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, getMediaTypeLabel } from "@/lib/file.utils";
import { FileIcon } from "./FileIcon";
import { Upload } from "@/types";
import { ResourceCardSkeleton } from "./ResourceCardSkeleton";
import { api } from "@/api";

interface ResourceCardProps {
  className?: string;
  resource: Upload;
  previewResource?: () => void;
  deleteResource?: () => void;
  isPending?: boolean;
}

export const ResourceCard = ({
  className,
  resource,
  previewResource,
  deleteResource,
  isPending,
}: ResourceCardProps) => {
  if (isPending) {
    return <ResourceCardSkeleton className={className} />;
  }

  return (
    <Card
      key={resource.id}
      className={cn("overflow-hidden flex flex-col h-full", className)}
    >
      <CardHeader className="rounded-md flex flex-row  gap-4 items-center justify-between overflow-hidden py-4">
        <div>
          <FileIcon type={resource.mimetype || ""} size={32} />
        </div>
        <h3 className="font-bold truncate" title={resource.filename}>
          {resource.filename}
        </h3>

        <Badge variant="outline" className="my-2">
          {getMediaTypeLabel(resource.mimetype || "")}
        </Badge>
      </CardHeader>
      <CardContent className="px-6 flex-1">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-bold">Size:</span>{" "}
            {formatFileSize(resource.size)}
          </p>
          <p>
            <span className="font-bold">Uploaded:</span>{" "}
            {format(resource.createdAt, "PPpp")}
          </p>
          <p>
            <span className="font-bold">By:</span>{" "}
            {resource.user?.username || "Unknown"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 bg-muted/50 px-4 py-4">
        <div className="flex flex-row gap-2 justify-between w-full">
          <Button
            className="w-full"
            variant="outline"
            onClick={previewResource}
          >
            <Eye />
            Preview
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={deleteResource}
          >
            <X />
            Delete
          </Button>
        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={() =>
            api.admin.upload.downloadFile(resource.slug, resource.filename)
          }
        >
          <Download />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};
