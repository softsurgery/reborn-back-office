import { ColumnDef } from "@tanstack/react-table";
import { DeviceInfo } from "@/types/device-info";
import { DataTableConfig } from "@/types";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableRowActions } from "@/components/Common/Datatables/data-table-row-actions";

export const getDeviceInfoColumns = (
  context: DataTableConfig<DeviceInfo>
): ColumnDef<DeviceInfo>[] => {
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
