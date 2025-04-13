import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Bug } from "@/types/bug";

export const getBugColumns = (): ColumnDef<Bug>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Title"}
          attribute="title"
        />
      ),
      cell: ({ row }) => <div>{row.original.title}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Description"}
          attribute="description"
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.description || "No description"}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Category"}
          attribute="category"
        />
      ),
      cell: ({ row }) => <div>{row.original.category || "No Category"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} />
        </div>
      ),
    },
  ];
};
