import { Card, CardFooter } from "@/components/ui/card";
import { Download } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, getMediaTypeLabel } from "@/lib/file.utils";
import { FileIcon } from "./FileIcon";

interface ResourceCardProps {
  className?: string;
  resource: any;
}

export const ResourceCard = ({ className, resource }: ResourceCardProps) => {
  return (
    <Card key={resource.id} className={cn("overflow-hidden flex flex-col h-full", className)}>
      <div className="p-4 flex-1">
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 overflow-hidden">
          {resource.thumbnail ? (
            <Image
              src={resource.thumbnail || "/react.svg"}
              alt={resource.name}
              width={300}
              height={200}
              className="w-full h-full object-cover"
            />
          ) : (
            <FileIcon type={resource.type} />
          )}
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="font-medium truncate" title={resource.name}>
              {resource.name}
            </h3>
            <Badge variant="outline" className="mt-1">
              {getMediaTypeLabel(resource.type)}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>Size: {formatFileSize(resource.size)}</p>
            <p>Uploaded: {format(resource.uploadedAt, "PPpp")}</p>
            <p>By: {resource.uploadedBy}</p>
          </div>
        </div>
      </div>

      <CardFooter className="bg-muted/50 p-4">
        <Button asChild className="w-full" variant="outline">
          <a href={resource.url} download>
            <Download className="mr-2 h-4 w-4" />
            Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
