import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Feedback } from "@/types/feedback";

export const getFeedbackColumns = (): ColumnDef<Feedback>[] => {
  return [
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Message"}
          attribute="message"
        />
      ),
      cell: ({ row }) => <div>{row.original.message}</div>,
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
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Rating"}
          attribute="rating"
        />
      ),
      cell: ({ row }) => <div>{row.original.category || "No Rating"}</div>,
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
