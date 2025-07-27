import { BookUser } from "lucide-react";
import { RoleUpdateForm } from "../forms/RoleUpdateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface RoleUpdateSheet {
  updateRole?: () => void;
  isUpdatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleUpdateSheet = ({
  updateRole,
  isUpdatePending,
  resetRole,
}: RoleUpdateSheet) => {
  const { t } = useTranslation("role");

  const {
    SheetFragment: updateRoleSheet,
    openSheet: openUpdateRoleSheet,
    closeSheet: closeUpdateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        {t("sheet.update.title")}
      </div>
    ),
    description: t("sheet.update.description"),
    children: (
      <RoleUpdateForm
        className="my-4"
        roleCallback={updateRole}
        cancelCallback={() => {
          closeUpdateRoleSheet?.();
          resetRole?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRole,
  });

  return {
    updateRoleSheet,
    openUpdateRoleSheet,
    closeUpdateRoleSheet,
  };
};
