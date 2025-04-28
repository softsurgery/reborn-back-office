import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Download, X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, getMediaTypeLabel } from "@/lib/file.utils";
import { FileIcon } from "./FileIcon";
import { Upload } from "@/types";
import { ResourceCardSkeleton } from "./ResourceCardSkeleton";

interface ResourceCardProps {
  className?: string;
  resource: Upload;
  isPending?: boolean;
}

export const ResourceCard = ({
  className,
  resource,
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
      <CardHeader className="bg-muted rounded-md flex flex-row  gap-4 items-center justify-between overflow-hidden">
        <div>
          {resource.thumbnail ? (
            <Image
              src={resource.thumbnail || "/react.svg"}
              alt={resource.name}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileIcon type={resource.mimetype || ""} size={32} />
          )}
        </div>
        <h3 className="font-bold truncate" title={resource.filename}>
          {resource.filename}
        </h3>

        <Badge variant="outline" className="my-2">
          {getMediaTypeLabel(resource.mimetype || "")}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 flex-1">
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
            <span className="font-bold">By:</span> {resource.uploadedBy}
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-4 pt-2">
        <div className="flex flex-row gap-4 justify-between w-full">
          <Button className="w-full" variant="outline">
            <Download />
            Download
          </Button>
          <Button className="w-full" variant="secondary">
            <X />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
