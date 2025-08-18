import { ColumnDef } from "@tanstack/react-table";
import { DataTableConfig, ResponseJobDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";

export const getJobColumns = (
  context: DataTableConfig<ResponseJobDto>
): ColumnDef<ResponseJobDto>[] => {
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
      cell: ({ row }) => {
        return <div>{row?.original?.title}</div>;
      },
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
      cell: ({ row }) => {
        return <div>{row?.original?.description}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Price"}
          attribute="price"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.price} TND</div>;
      },
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
