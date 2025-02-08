import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Permission } from "@/types/user-management";

export const getPermissionColumns = (): ColumnDef<Permission>[] => {
  return [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Label"}
          attribute="label"
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.label}</div>;
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
        />
      ),
      cell: ({ row }) => <div>{row?.original?.description}</div>,
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
