import { Table2 } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";
import { RefTypeUpdateForm } from "../forms/RefTypeUpdateForm";

interface RefTypeUpdateSheet {
  updateRefType?: () => void;
  isUpdatePending?: boolean;
  resetRefType?: () => void;
}

export const useRefTypeUpdateSheet = ({
  updateRefType,
  isUpdatePending,
  resetRefType,
}: RefTypeUpdateSheet) => {
  const { t } = useTranslation("content-management");

  const {
    SheetFragment: updateRefTypeSheet,
    openSheet: openUpdateRefTypeSheet,
    closeSheet: closeUpdateRefTypeSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Table2 />
        {t("refType.sheet.update.title")}
      </div>
    ),
    description: t("refType.sheet.update.description"),
    children: (
      <RefTypeUpdateForm
        className="mx-4"
        refTypeCallback={updateRefType}
        cancelCallback={() => {
          closeUpdateRefTypeSheet?.();
          resetRefType?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[30vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRefType,
  });

  return {
    updateRefTypeSheet,
    openUpdateRefTypeSheet,
    closeUpdateRefTypeSheet,
  };
};
