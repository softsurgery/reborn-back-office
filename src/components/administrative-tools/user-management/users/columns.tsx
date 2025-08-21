import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/shared/data-tables/data-table-column-header";
import { DataTableRowActions } from "@/components/shared/data-tables/data-table-row-actions";
import { ResponseUserDto } from "@/types";
import DataTableCell from "@/components/shared/data-tables/core/data-table-cell";
import { useTranslation } from "react-i18next";
import { identifyUserAvatar } from "@/lib/user.utils";
import UserAvatarCell from "./UserAvatarCell";
import { DataTableCellVariant } from "@/components/shared/data-tables/types";

export const useUserColumns = (
  context: any,
  t: any
): ColumnDef<ResponseUserDto>[] => {
  const { t: tCommon } = useTranslation("common");

  return [
    {
      accessorKey: "Photo",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Photo"
          attribute="photo"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <UserAvatarCell
          pictureId={row?.original?.profile?.pictureId}
          fallback={identifyUserAvatar(row?.original)}
        />
      ),
    },
    {
      accessorKey: `${t("userManagement.table.username")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.username")}
          attribute="username"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div className="font-bold">{row.original.username}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.email")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.email")}
          attribute="email"
          context={context}
        />
      ),
      cell: ({ row }) => <div className="font-bold">{row.original.email}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.firstName")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.firstName")}
          attribute="firstName"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.firstName || (
            <span className="opacity-70">
              {t("userManagement.errors.notDefined")}
            </span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.lastName")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.lastName")}
          attribute="lastName"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.lastName || (
            <span className="opacity-70">
              {t("userManagement.errors.notDefined")}
            </span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.dateOfBirth")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.dateOfBirth")}
          attribute="dateOfBirth"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {(row.original.dateOfBirth &&
            format(row.original.dateOfBirth, "yyyy-MM-dd")) || (
            <span className="opacity-70">
              {t("userManagement.errors.notDefined")}
            </span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.role")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.role")}
          attribute="role.label"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original?.roleId || (
            <span className="opacity-70">
              {t("userManagement.errors.roleNotFound")}
            </span>
          )}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.isActive")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.isActive")}
          attribute="isActive"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "secondary"}
          className={cn("font-bold")}
        >
          {row.original.isActive
            ? tCommon("common.buttons.yes")
            : tCommon("common.buttons.no")}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.isApproved")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.isApproved")}
          attribute="isApproved"
          context={context}
        />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.isApproved ? "default" : "secondary"}
          className={cn("font-bold")}
        >
          {row.original.isApproved
            ? tCommon("common.buttons.yes")
            : tCommon("common.buttons.no")}
        </Badge>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: `${t("userManagement.table.createdAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.createdAt")}
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
      accessorKey: `${t("userManagement.table.updatedAt")}`,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("userManagement.table.updatedAt")}
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
