
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { formatFileSize } from "@/lib/file.utils";
import { DataTableCellVariant, Upload } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const getUploadColumns = (context: any): ColumnDef<Upload>[] => {
  return [
    {
      accessorKey: "Filename",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Filename"
          attribute="filename"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.filename}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Slug",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Slug"
          attribute="slug"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.slug}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Mime Type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Mime Type"
          attribute="mimetype"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.mimetype}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Size",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Size"
          attribute="size"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{formatFileSize(row.original.size)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Uploaded At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Uploaded At"
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.updatedAt);
        return (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={date}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
