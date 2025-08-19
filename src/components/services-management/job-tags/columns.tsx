import { ColumnDef } from "@tanstack/react-table";
import { DataTableConfig, ResponseJobTagDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";


export const getJobTagColumns = (
  context: DataTableConfig<ResponseJobTagDto>
): ColumnDef<ResponseJobTagDto>[] => {
  return [
    {
      accessorKey: "ID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"ID"}
          attribute="id"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.id}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Label"}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.label}</div>;
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
