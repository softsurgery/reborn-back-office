import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DeviceInfo } from "@/types/device-info";
import { DataTableRowActions } from "./data-table-row-actions";

export const getDeviceInfoColumns = (): ColumnDef<DeviceInfo>[] => {
  return [
    {
      accessorKey: "platform",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Platform"}
          attribute="platform"
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
          <DataTableRowActions row={row} />
        </div>
      ),
    },
  ];
};
