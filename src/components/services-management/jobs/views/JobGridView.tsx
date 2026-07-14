import React from "react";
import { ResponseJobDto } from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { JobCard } from "./JobCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Plus, PackageOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFooter } from "@/contexts/FooterContext";
import { DataTablePagination } from "@/components/shared/data-tables/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  const { setContent } = useFooter();
  const { t } = useTranslation("common");
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (footerPagination) {
      setContent?.(
        <DataTablePagination
          table={{} as any}
          context={context}
          className="px-10"
        />
      );
    } else {
      setContent?.(null);
    }
    return () => {
      setContent?.(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [footerPagination, context.totalPageCount, context.size, context.page]);

  React.useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage?.();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      className={cn(
        "flex flex-col flex-1 space-y-4 p-1",
        footerPagination ? "overflow-hidden" : "",
        className,
      )}
    >
      {/* Grid Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={`${t("common.placeholders.filter")} ${
              context.pluralName
            }...`}
            value={context?.searchTerm?.toString() || ""}
            onChange={(event) => {
              context.setPage(1);
              context?.setSearchTerm?.(event.target.value);
            }}
            className="h-8 max-w-sm"
          />
          {context.searchTerm && (
            <Button
              variant="ghost"
              onClick={() => {
                context.setPage(1);
                context?.setSearchTerm?.("");
              }}
            >
              {t("common.buttons.reset")}
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {context.createCallback && (
          <Button onClick={() => context.createCallback?.()}>
            <Plus className="h-4 w-4 mr-1.5" />
            {t("common.buttons.new")} {context.singularName}
          </Button>
        )}
      </div>

      {/* Grid Content */}
      <div
        className={cn(
          "flex-1 pb-16 pr-1",
          footerPagination ? "overflow-y-auto" : "",
          containerClassName
        )}
      >
        {isPending ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col space-y-3 p-4 rounded-xl border border-border/60 bg-card/50 h-64"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md mt-2" />
                <Skeleton className="h-7 w-20 rounded-full my-2" />
                <Skeleton className="h-12 w-full rounded-md" />
                <div className="flex justify-between mt-auto pt-3 border-t border-border/40">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              </div>
            ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} context={context} />
              ))}
            </div>
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="w-full flex items-center justify-center py-8 mt-4"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>{t("common.table.loadingMore", "Loading more...")}</span>
                  </div>
                ) : (
                  <span className="text-xs text-transparent select-none">.</span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
