import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { Trans } from "@/components/shared/Trans";
import { DataTableCellVariant, DataTableConfig, ResponseLogDto } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const getLoggerColumns = (
  context: DataTableConfig<ResponseLogDto>
): ColumnDef<ResponseLogDto>[] => {
  return [
    {
      accessorKey: "event",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Event"}
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Description"}
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
      accessorKey: "Logged At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Logged At"}
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
