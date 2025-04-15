import { ColumnDef } from "@tanstack/react-table";
import { Role } from "@/types/user-management";
import { DataTableConfig } from "@/types";
import { DataTableColumnHeader } from "@/components/Common/Datatables/data-table-column-header";
import { DataTableRowActions } from "@/components/Common/Datatables/data-table-row-actions";

export const getRoleColumns = (context: DataTableConfig<Role>): ColumnDef<Role>[] => {
  return [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Label"
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Description"
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.description || "No Description"}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "permissions",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Permissions"
          attribute="permissions"
          context={context}
        />
      ),
      cell: ({ row }) => {
        // Ensure `entries` is always an array to prevent undefined errors
        const entries = row.original.permissions ?? [];

        if (entries.length === 0) {
          return <div className="opacity-70">No Permissions</div>;
        }

        const visiblePermissions = entries.slice(0, 2); // Show first 2 permissions
        const hiddenPermissions = entries.length - visiblePermissions.length;
        return (
          <div>
            <div className="line-clamp-1">
              {visiblePermissions.map((entry, index) => (
                <span key={index} className="mr-1">
                  {entry?.permission?.label?.toUpperCase() || "Unknown"}
                  {index < visiblePermissions.length - 1 && ", "}
                </span>
              ))}
              {hiddenPermissions > 0 && (
                <span className="opacity-50 mx-2">{`+${hiddenPermissions} more`}</span>
              )}
            </div>
          </div>
        );
      },
      enableSorting: false,
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