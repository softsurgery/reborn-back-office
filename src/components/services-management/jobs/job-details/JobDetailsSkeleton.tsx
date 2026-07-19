import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface JobDetailsSkeletonProps {
  className?: string;
}

export const JobDetailsSkeleton: React.FC<JobDetailsSkeletonProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col flex-1 p-6 space-y-6 container mx-auto w-full",
        className,
      )}
    >
      <Skeleton className="h-96 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-2 rounded-2xl" />
        <Skeleton className="h-64 lg:col-span-1 rounded-2xl" />
      </div>
    </div>
  );
};
