import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";
import { PlusIcon } from "lucide-react";
import { DataTableConfig } from "@/types";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  context: DataTableConfig<TData>;
}

export function DataTableToolbar<TData>({
  table,
  context,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter ${context.pluralName}...`}
          value={context?.searchTerm?.toString()}
          onChange={(event) => {
            context.setPage(1);
            context?.setSearchTerm?.(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {context.searchTerm && (
          <Button
            variant="ghost"
            onClick={() => context?.setSearchTerm?.("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {context.createCallback && (
        <Button
          variant="outline"
          onClick={() => context.createCallback?.()}
          className="hidden h-8 w-8 p-0 lg:flex"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
