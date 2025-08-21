import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { ResponseRoleDto } from "@/types";
import { useTranslation } from "react-i18next";
import { DataTableConfig } from "@/components/shared/data-tables/types";

export const useRoleColumns = (
  context: DataTableConfig<ResponseRoleDto>
): ColumnDef<ResponseRoleDto>[] => {
  const { t } = useTranslation("role");
  const { t: tCommon } = useTranslation("common");
  return [
    {
      accessorKey: `${t("columns.label")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.description || t("columns.noDescription")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("columns.permissions")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("columns.permissions")}
          attribute="permissions"
          context={context}
        />
      ),
      cell: ({ row }) => {
        // Ensure `entries` is always an array to prevent undefined errors
        const entries = row.original.permissions.map((p) => p.permission) ?? [];

        if (entries.length === 0) {
          return <div className="opacity-70">{t("columns.noPermissions")}</div>;
        }

        const visiblePermissions = entries.slice(0, 2); // Show first 2 permissions
        const hiddenPermissions = entries.length - visiblePermissions.length;
        return (
          <div>
            <div className="line-clamp-1">
              {visiblePermissions.map((entry, index) => (
                <span key={index} className="mr-1">
                  {entry?.label?.toUpperCase() ||
                    tCommon("common.general.unknown")}
                  {index < visiblePermissions.length - 1 && ", "}
                </span>
              ))}
              {hiddenPermissions > 0 && (
                <span className="opacity-50 mx-2">{`+${hiddenPermissions}${" "}${tCommon(
                  "common.general.more"
                )}`}</span>
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
