import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";
import { usePermissionActions } from "./ActionContext";
import { Blocks } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { openSeedPermissionDialog, setPage, searchTerm, setSearchTerm } =
    usePermissionActions();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Filter Permissions"
          value={searchTerm.toString()}
          onChange={(event) => {
            setPage(1);
            setSearchTerm(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button className="h-8 px-2 lg:px-3" variant="ghost" onClick={openSeedPermissionDialog}>
          <Blocks className="h-6 w-6" />
          Seed Permissions
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
