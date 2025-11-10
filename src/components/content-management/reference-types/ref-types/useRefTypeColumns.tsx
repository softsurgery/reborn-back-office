import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { ResponseRefTypeDto } from "@/types";
import { useTranslation } from "react-i18next";
import { DataTableConfig } from "@/components/shared/data-tables/types";

export const useRefTypeColumns = (
  context: DataTableConfig<ResponseRefTypeDto>
): ColumnDef<ResponseRefTypeDto>[] => {
  const { t } = useTranslation("content-management");
  return [
    {
      accessorKey: `${t("refType.columns.id")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refType.columns.id")}
          attribute="id"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refType.columns.label")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refType.columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refType.columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refType.columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.description || t("refType.columns.noDescription")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refType.columns.parent")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refType.columns.parent")}
          attribute="parent"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.parent?.label || t("refType.columns.noParent")}</div>
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
