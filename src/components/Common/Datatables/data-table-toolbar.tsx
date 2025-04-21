import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";
import { PackagePlus, Plus, PlusIcon } from "lucide-react";
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
          className="h-8"
        />
        {context.searchTerm && (
          <Button
            variant="ghost"
            onClick={() => context?.setSearchTerm?.("")}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
      {context.createCallback && (
        <Button  onClick={() => context.createCallback?.()}>
          <Plus className="h-4 w-4" />
          New {context.singularName}
        </Button>
      )}
    </div>
  );
}
