import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { set } from "date-fns";
import { DataTableViewOptions } from "./data-table-view-options";
import { PlusIcon } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  context: {
    triggerCreate?: () => void;
    setPage: (page: number) => void;
    searchTerm: string;
    setSearchTerm: (searchTerm: string) => void;
  };
}

export function DataTableToolbar<TData>({
  table,
  context,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Bugs..."
          value={context.searchTerm.toString()}
          onChange={(event) => {
            context.setPage(1);
            context.setSearchTerm(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {context.searchTerm && (
          <Button
            variant="ghost"
            onClick={() => context.setSearchTerm("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {context.triggerCreate && (
        <Button
          variant="outline"
          onClick={() => context.triggerCreate?.()}
          className="hidden h-8 w-8 p-0 lg:flex"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
      )}
      <DataTableViewOptions table={table} />
    </div>
  );
}
