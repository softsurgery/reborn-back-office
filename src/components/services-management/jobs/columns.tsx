import { ColumnDef } from "@tanstack/react-table";
import { ResponseJobDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { useTranslation } from "react-i18next";
import {
  DataTableCellVariant,
  DataTableConfig,
} from "@/components/shared/data-tables/types";
import { identifyUser } from "@/lib/user.utils";
import Link from "next/link";

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
      accessorKey: "Pictures",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Pictures"
          attribute=""
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.uploads?.length || 0}</div>;
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "Tags",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.tags")}
          attribute="tags"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return row?.original?.tags.length > 0 ? (
          <div>{row?.original?.tags?.map((tag) => tag.label).join(", ")}</div>
        ) : (
          <div className="opacity-60">{t("job.columns.noTags")}</div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "Category",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.category")}
          attribute="category"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.category?.label}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Posted By",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("job.columns.postedBy")}
          attribute="postedBy"
          context={context}
        />
      ),
      cell: ({ row }) => {
        if (!row?.original?.postedBy) return <div>-</div>;
        return (
          <Link
            href={`/user-management/users/${row?.original?.postedBy?.id}`}
            className="text-primary hover:underline"
          >
            {identifyUser(row?.original?.postedBy)}
          </Link>
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
