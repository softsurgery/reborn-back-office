import { ColumnDef } from "@tanstack/react-table";
import { ResponseJobCategoryDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { DataTableConfig } from "@/components/shared/data-tables/types";
import { useTranslation } from "react-i18next";

export const useJobCategoryColumns = (
  context: DataTableConfig<ResponseJobCategoryDto>
): ColumnDef<ResponseJobCategoryDto>[] => {
  const { t } = useTranslation("job");
  return [
    {
      accessorKey: "ID",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"ID"}
          attribute="id"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.id}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("jobCategory.columns.label")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("jobCategory.columns.label")}
          attribute="label"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.label}</div>;
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
