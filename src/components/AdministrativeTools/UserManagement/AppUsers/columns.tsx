import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { MobileUser } from "@/types/user-management";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableRowActions } from "@/components/Common/Datatables/data-table-row-actions";
import { DataTableConfig } from "@/types";

export const getMobileUserColumns = (
  context: DataTableConfig<MobileUser>
): ColumnDef<MobileUser>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="ID"
          attribute="id"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "userId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="User ID"
          attribute="userId"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.userId}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Username"
          attribute="Username"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {row.original.user?.username
            ? row.original.user?.username
            : "Non-specified"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Email"
          attribute="Email"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {row.original.user?.email
            ? row.original.user?.email
            : "Non-specified"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Region",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Region"
          attribute="Region"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">
          {row.original.region?.label
            ? row.original.region?.label
            : "Non-specified"}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {(row.original.createdAt &&
            format(new Date(row.original.createdAt), "yyyy-MM-dd hh:mm")) || (
            <span className="opacity-70">Not Defined</span>
          )}
        </div>
      ),
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
