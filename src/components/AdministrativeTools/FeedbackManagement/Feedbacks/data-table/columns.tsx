import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Feedback } from "@/types/Feedback";

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
      cell: ({ row }) => {
        return <div>{row?.original?.message}</div>;
      },
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
      cell: ({ row }) => <div>{row?.original?.rating}</div>,
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
      cell: ({ row }) => <div>{row?.original?.category}</div>,
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
