import { ColumnDef } from "@tanstack/react-table";
import {
  DataTableCellVariant,
  DataTableConfig,
  ResponseFeedbackDto,
} from "@/types";
import { splitCamelOrPascal } from "@/lib/string.lib";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { useTranslation } from "react-i18next";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { identifyUser } from "@/lib/user.utils";

export const useFeedbackColumns = (
  context: DataTableConfig<ResponseFeedbackDto>
): ColumnDef<ResponseFeedbackDto>[] => {
  const { t } = useTranslation("feedback");
  return [
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("feedback.columns.message")}
          attribute="message"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.message}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("feedback.columns.rating")}
          attribute="rating"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.rating || t("feedback.columns.noRating")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("feedback.columns.category")}
          attribute="category"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {splitCamelOrPascal(row.original.category) ||
            t("feedback.columns.noCategory")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("feedback.columns.user")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("feedback.columns.user")}
          attribute="user"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{identifyUser(row.original.user)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("feedback.columns.createdAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("feedback.columns.createdAt")}
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
