import React from "react";
import { ResponseJobDto } from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { JobCard } from "./JobCard";
import { PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";
import { InfiniteScrollTrigger } from "@/components/shared/InfiniteScrollTrigger";

interface JobGridViewProps {
  className?: string;
  containerClassName?: string;
  jobs: ResponseJobDto[];
  context: DataTableConfig<ResponseJobDto>;
  isPending: boolean;
  footerPagination?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export const JobGridView: React.FC<JobGridViewProps> = ({
  className,
  containerClassName,
  jobs,
  context,
  isPending,
  footerPagination = true,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={cn(
        "flex flex-col flex-1 space-y-4 container",
        footerPagination ? "overflow-hidden" : "",
        className,
      )}
    >
      {/* Grid Content */}
      <div
        className={cn(
          "flex-1 pr-1",
          footerPagination ? "overflow-y-auto" : "",
          containerClassName,
        )}
      >
        {isPending ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center justify-center gap-2 font-bold">
              {t("common.table.loading")} <Spinner />
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border/60 rounded-xl bg-card/30 p-8 text-center my-6">
            <PackageOpen className="h-12 w-12 text-muted-foreground/60 mb-3" />
            <span className="text-sm font-bold text-foreground">
              {t("common.table.noResults")}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Try adjusting your search query or filters.
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} context={context} />
              ))}
            </div>
            <InfiniteScrollTrigger
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
          </>
        )}
      </div>
    </div>
  );
};
