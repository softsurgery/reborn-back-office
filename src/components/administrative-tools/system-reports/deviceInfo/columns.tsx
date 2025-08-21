import { ColumnDef } from "@tanstack/react-table";
import { DataTableConfig, ResponseDeviceInfoDto } from "@/types";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { useTranslation } from "react-i18next";

export const useDeviceInfoColumns = (
  context: DataTableConfig<ResponseDeviceInfoDto>
): ColumnDef<ResponseDeviceInfoDto>[] => {
  const { t } = useTranslation("deviceInfo");
  return [
    {
      accessorKey: `${t("deviceInfo.columns.platform")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("deviceInfo.columns.platform")}
          attribute="platform"
          context={context}
        />
      ),
      cell: ({ row }) => {
        return <div>{row?.original?.platform}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("deviceInfo.columns.model")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("deviceInfo.columns.model")}
          attribute="model"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.model}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("deviceInfo.columns.version")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("deviceInfo.columns.version")}
          attribute="version"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.version}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("deviceInfo.columns.manufacture")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("deviceInfo.columns.manufacturer")}
          attribute="manufacturer"
          context={context}
        />
      ),
      cell: ({ row }) => <div>{row?.original?.manufacturer}</div>,
      enableSorting: true,
      enableHiding: true,
    },
  ];
};
