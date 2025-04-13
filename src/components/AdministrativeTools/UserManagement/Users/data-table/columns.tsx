import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { User } from "@/types/user-management";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";

export const getUserColumns = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" attribute="id" />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Username"
          attribute="username"
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">{row.original.username}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="E-Mail"
          attribute="email"
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Firstname"
          attribute="firstName"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.firstName || (
            <span className="opacity-70">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Lastname"
          attribute="lastName"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.lastName || (
            <span className="opacity-70">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "dateOfBirth",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date of Birth"
          attribute="dateOfBirth"
        />
      ),
      cell: ({ row }) => (
        <div>
          {(row.original.dateOfBirth &&
            format(row.original.dateOfBirth, "yyyy-MM-dd")) || (
            <span className="opacity-70">Not Defined</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "roleId",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          attribute="role.label"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.role?.label || (
            <span className="opacity-70">No Role Assigned Yet</span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "active",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Active"
          attribute="isActive"
        />
      ),
      cell: ({ row }) => (
        <Badge
          className={cn(
            "font-bold text-white",
            row.original.isActive ? "bg-green-600" : "bg-red-600"
          )}
        >
          {row.original.isActive ? "Yes" : "No"}
        </Badge>
      ),
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
