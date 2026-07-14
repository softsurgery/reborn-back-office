import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { ResponseRefParamDto } from "@/types";
import { useTranslation } from "react-i18next";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { Badge } from "@/components/ui/badge";
import { JsonToggler } from "@/components/shared/JsonToggler";
import { cn } from "@/lib/utils";

export const useRefParamColumns = (
  context: DataTableConfig<ResponseRefParamDto>,
): ColumnDef<ResponseRefParamDto>[] => {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("content-management");
  return [
    {
      accessorKey: `${t("refParam.columns.label")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.label}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className={cn(!row.original.description && "opacity-70")}>
          {row.original.description || t("refParam.columns.noDescription")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.refTypeId")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.refTypeId")}
          attribute="refTypeId"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.refType?.label} ({row.original.refTypeId})
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("refParam.columns.extras")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("refParam.columns.extras")}
          attribute="logInfo"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const extras = row?.original?.extras;
        return extras && Object.keys(extras).length > 0 ? (
          <JsonToggler data={extras} className="w-full" />
        ) : (
          <Badge variant="outline" className="text-xs">
            {tCommon("common.table.noData")}
          </Badge>
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
