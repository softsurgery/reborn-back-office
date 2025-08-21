import { ColumnDef } from "@tanstack/react-table";
import { DataTableCellVariant, DataTableConfig, ResponseJobDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { useTranslation } from "react-i18next";

export const useJobColumns = (
  context: DataTableConfig<ResponseJobDto>
): ColumnDef<ResponseJobDto>[] => {
  const { t } = useTranslation("job");
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.title")}
          attribute="title"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.title}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.description")}
          attribute="description"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.description}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.price")}
          attribute="price"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return (
          <div>
            {row?.original?.price} {row?.original?.currency?.symbol}
          </div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Created At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.createdAt")}
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
      accessorKey: "Updated At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.updatedAt")}
          attribute="updatedAt"
          context={context}
        />
      ),
      cell: ({ row }) => {
        const date = new Date(row?.original?.updatedAt);
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
