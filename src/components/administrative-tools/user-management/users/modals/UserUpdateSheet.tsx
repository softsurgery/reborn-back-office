import { User } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { UserUpdateForm } from "../forms/UserUpdateForm";
import { useTranslation } from "react-i18next";

interface UserUpdateSheet {
  updateUser?: () => void;
  isUpdatePending?: boolean;
  resetUser?: () => void;
}

export const useUserUpdateSheet = ({
  updateUser,
  isUpdatePending,
  resetUser,
}: UserUpdateSheet) => {
  const { t } = useTranslation("user-management");
  const {
    SheetFragment: updateUserSheet,
    openSheet: openUpdateUserSheet,
    closeSheet: closeUpdateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        {t("userManagement.sheet.updateUserTitle")}
      </div>
    ),
    description:
      t("userManagement.sheet.updateUserDescription"),
    children: (
      <UserUpdateForm
        userCallback={updateUser}
        cancelCallback={() => {
          closeUpdateUserSheet?.();
          resetUser?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetUser,
  });

  return {
    updateUserSheet,
    openUpdateUserSheet,
    closeUpdateUserSheet,
  };
};
