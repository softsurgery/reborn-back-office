import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { ResponsePermissionDto } from "@/types";
import { DataTableConfig } from "@/components/shared/data-tables/types";

export const getPermissionColumns = (
  context: DataTableConfig<ResponsePermissionDto>
): ColumnDef<ResponsePermissionDto>[] => {
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
