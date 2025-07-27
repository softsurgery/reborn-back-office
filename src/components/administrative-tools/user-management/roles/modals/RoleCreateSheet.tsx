import { BookUser } from "lucide-react";
import { RoleCreateForm } from "../forms/RoleCreateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface RoleCreateSheet {
  createRole?: () => void;
  isCreatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleCreateSheet = ({
  createRole,
  isCreatePending,
  resetRole,
}: RoleCreateSheet) => {
  const { t } = useTranslation("role");

  const {
    SheetFragment: createRoleSheet,
    openSheet: openCreateRoleSheet,
    closeSheet: closeCreateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t("sheet.create.title")}
      </div>
    ),
    description: t("sheet.create.description"),
    children: (
      <RoleCreateForm
        className="my-4"
        roleCallback={createRole}
        cancelCallback={() => {
          closeCreateRoleSheet?.();
          resetRole?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRole,
  });

  return {
    createRoleSheet,
    openCreateRoleSheet,
    closeCreateRoleSheet,
  };
};
