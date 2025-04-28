import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ResourceCardSkeletonProps {
  className?: string;
}

export const ResourceCardSkeleton = ({
  className,
}: ResourceCardSkeletonProps) => {
  return (
    <Card className={cn("overflow-hidden flex flex-col h-full", className)}>
      <CardHeader className="bg-muted rounded-md flex flex-row gap-4 items-center justify-between overflow-hidden">
        {/* Thumbnail or Icon */}
        <div className="w-16 h-16">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Filename */}
        <div className="flex-1">
          <Skeleton className="h-6" />
        </div>

        {/* Badge */}
        <div>
          <Skeleton className="h-5 w-20" />
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Metadata */}
        <div className="text-sm text-muted-foreground space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 bg-muted/50 px-4 pt-2">
        <div className="flex flex-row gap-2 justify-between w-full">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
};
