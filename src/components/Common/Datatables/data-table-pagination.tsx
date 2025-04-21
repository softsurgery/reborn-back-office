import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DataTableConfig } from "@/types";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

interface DataTablePaginationProps<TData> {
  className?: string;
  table: Table<TData>;
  context: DataTableConfig<TData>;
}

export function DataTablePagination<TData>({
  table,
  context,
  className,
}: DataTablePaginationProps<TData>) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center space-x-2 ">
        <div className="flex items-center space-x-2">
          {[10, 50, 100].map((size) => {
            return (
              <Toggle
                key={size}
                onClick={() => context.setSize(size)}
                pressed={size == context.size}
              >
                {size}
              </Toggle>
            );
          })}
        </div>
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center text-xs font-medium">
          Page {context.page} of {context.totalPageCount}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => context.setPage(1)}
            disabled={context.page == 1}
          >
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => context.setPage(context.page - 1)}
            disabled={context.page <= 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => context.setPage(context.page + 1)}
            disabled={context.page >= context.totalPageCount}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => context.setPage(context.totalPageCount)}
            disabled={context.page == context.totalPageCount}
          >
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
