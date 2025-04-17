import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { Region } from "@/types";

export const getRegionColumns = (context: any): ColumnDef<Region>[] => {
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
  ];
};
