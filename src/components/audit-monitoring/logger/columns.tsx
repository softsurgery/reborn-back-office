import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import {
  DataTableCellVariant,
  DataTableConfig,
} from "@/components/shared/data-tables/types";
import { Trans } from "@/components/shared/Trans";
import { ResponseLogDto } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

export const useLoggerColumns = (
  context: DataTableConfig<ResponseLogDto>
): ColumnDef<ResponseLogDto>[] => {
  const { t } = useTranslation("logs");
  return [
    {
      accessorKey: `${t("logger.columns.event")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("logger.columns.event")}
          attribute="event"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const event = row?.original?.event;
        return <Trans ns="logs" i18nKey={`titles.${event}`} />;
      },
      enableSorting: true,
      enableHiding: true,
    },

    {
      accessorKey: `${t("logger.columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("logger.columns.description")}
          attribute="event"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const event = row?.original?.event;
        return (
          <Trans
            ns="logs"
            i18nKey={`descriptions.${event}`}
            values={{
              ...row.original.logInfo,
              user: { username: row?.original?.user?.username },
            }}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("logger.columns.loggedAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("logger.columns.loggedAt")}
          attribute="createdAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.createdAt);
        return (
          <DataTableCell
            variant={DataTableCellVariant.DATE_TIME}
            value={date}
          />
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
