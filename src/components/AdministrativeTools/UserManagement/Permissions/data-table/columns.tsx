import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableConfig, Permission } from "@/types";

export const getPermissionColumns = (context: DataTableConfig<Permission>): ColumnDef<Permission>[] => {
  return [
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Description"}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.description}</div>,
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
