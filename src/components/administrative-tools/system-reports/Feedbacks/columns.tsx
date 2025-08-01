import { ColumnDef } from "@tanstack/react-table";
import { DataTableConfig, ResponseFeedbackDto } from "@/types";
import { splitCamelOrPascal } from "@/lib/string.lib";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";

export const getFeedbackColumns = (
  context: DataTableConfig<ResponseFeedbackDto>
): ColumnDef<ResponseFeedbackDto>[] => {
  return [
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Message"}
          attribute="message"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.message}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Rating"}
          attribute="rating"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.rating || "No Rating"}</div>,
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
      cell: ({ row }) => (
        <div>{splitCamelOrPascal(row.original.category) || "No Category"}</div>
      ),
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
