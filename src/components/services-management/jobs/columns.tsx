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
  const { t: tCommon } = useTranslation("common");
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
        return (
          <div className="line-clamp-3 max-w-48">{row?.original?.title}</div>
        );
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
        return (
          <div className="line-clamp-3 max-w-72">
            {row?.original?.description}
          </div>
        );
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
          title="Tags"
          attribute="tags"
          context={context}
        />
      ),
      cell: ({ row }) => {
        // Ensure `entries` is always an array to prevent undefined errors
        const entries = row.original.tags.map((p) => p.label) ?? [];

        if (entries.length === 0) {
          return <div className="opacity-70">{t("columns.noTags")}</div>;
        }

        const visibleTags = entries.slice(0, 2);
        const hiddenTags = entries.length - visibleTags.length;
        return (
          <div>
            <div className="line-clamp-1">
              {visibleTags.map((entry, index) => (
                <span key={index} className="mr-1">
                  {entry?.toUpperCase() || tCommon("common.general.unknown")}
                  {index < visibleTags.length - 1 && ", "}
                </span>
              ))}
              {hiddenTags > 0 && (
                <span className="opacity-50 mx-2">{`+${hiddenTags}${" "}${tCommon(
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
