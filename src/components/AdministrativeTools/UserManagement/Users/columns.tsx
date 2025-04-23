import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { User } from "@/types/user-management";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableRowActions } from "@/components/Common/Datatables/data-table-row-actions";

export const getUserColumns = (context: any): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "ID",
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
      accessorKey: "Username",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Username"
          attribute="username"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">{row.original.username}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "E-mail",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="E-Mail"
          attribute="email"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "FirstName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Firstname"
          attribute="firstName"
          context={context}
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
      accessorKey: "LastName",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Lastname"
          attribute="lastName"
          context={context}
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
      accessorKey: "Date of Birth",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date of Birth"
          attribute="dateOfBirth"
          context={context}
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
      accessorKey: "Role",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Role"
          attribute="role.label"
          context={context}
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
      accessorKey: "Active",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Active"
          attribute="isActive"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <Badge
          className={cn(
            "font-bold text-foreground",
            row.original.isActive ? "bg-primary" : "bg-secondary"
          )}
        >
          {row.original.isActive ? "Yes" : "No"}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Approved",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Approved"
          attribute="isApproved"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <Badge
          className={cn(
            "font-bold text-foreground",
            row.original.isApproved ? "bg-primary" : "bg-secondary"
          )}
        >
          {row.original.isApproved ? "Yes" : "No"}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Creation Date",
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
            format(row.original.createdAt, "yyyy-MM-dd hh:mm")) || (
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
