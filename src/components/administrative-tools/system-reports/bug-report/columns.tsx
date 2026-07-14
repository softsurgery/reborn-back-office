import { ColumnDef } from "@tanstack/react-table";
import { ResponseBugDto } from "@/types/system-reports";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { useTranslation } from "react-i18next";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { identifyUser } from "@/lib/user.utils";
import { DataTableCellVariant } from "@/components/shared/data-tables/types";
import { cn } from "@/lib/utils";

export const useBugColumns = (context: any): ColumnDef<ResponseBugDto>[] => {
  const { t } = useTranslation("bug");
  return [
    {
      accessorKey: `${t("bug.columns.title")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("bug.columns.title")}
          attribute="title"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row.original.title}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("bug.columns.description")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("bug.columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className={cn(!row.original.description && "opacity-70")}>
          {row.original.description || t("bug.columns.noDescription")}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("bug.columns.variant")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("bug.columns.variant")}
          attribute="variant"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.variant || t("bug.columns.noVariant")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("bug.columns.user")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("bug.columns.user")}
          attribute="user"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{identifyUser(row.original.user)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("bug.columns.createdAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("bug.columns.createdAt")}
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
