import { ColumnDef } from "@tanstack/react-table";
import { ResponseBugDto } from "@/types/system-reports";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";

export const useBugColumns = (context: any): ColumnDef<ResponseBugDto>[] => {
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
      accessorKey: "variant",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Variant"}
          attribute="variant"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.variant || "No Variant"}</div>,
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
