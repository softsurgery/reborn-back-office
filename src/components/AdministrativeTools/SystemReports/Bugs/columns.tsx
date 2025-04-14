import { ColumnDef } from "@tanstack/react-table";
import { Bug } from "@/types/bug";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableRowActions } from "@/components/Common/Datatables/data-table-row-actions";

export const getBugColumns = (context: any): ColumnDef<Bug>[] => {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Title"}
          attribute="title"
          context={context}
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
          context={context}
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
          context={context}
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
          <DataTableRowActions row={row} context={context} />
        </div>
      ),
    },
  ];
};
