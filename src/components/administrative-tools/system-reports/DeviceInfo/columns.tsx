import { ColumnDef } from "@tanstack/react-table";
import { DataTableConfig, ResponseDeviceInfoDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";


export const getDeviceInfoColumns = (
  context: DataTableConfig<ResponseDeviceInfoDto>
): ColumnDef<ResponseDeviceInfoDto>[] => {
  return [
    {
      accessorKey: "platform",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Platform"}
          attribute="platform"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.platform}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Model"}
          attribute="model"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.model}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Version"}
          attribute="version"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.version}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "manufacturer",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Manufacturer"}
          attribute="manufacturer"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.manufacturer}</div>,
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
