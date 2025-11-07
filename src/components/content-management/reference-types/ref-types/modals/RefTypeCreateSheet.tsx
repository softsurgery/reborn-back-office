import { Table2 } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";
import { RefTypeCreateForm } from "../forms/RefTypeCreateForm";

interface RefTypeCreateSheet {
  createRefType?: () => void;
  isCreatePending?: boolean;
  resetRefType?: () => void;
}

export const useRefTypeCreateSheet = ({
  createRefType,
  isCreatePending,
  resetRefType,
}: RefTypeCreateSheet) => {
  const { t } = useTranslation("content-management");

  const {
    SheetFragment: createRefTypeSheet,
    openSheet: openCreateRefTypeSheet,
    closeSheet: closeCreateRefTypeSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Table2 />
        {t("refType.sheet.create.title")}
      </div>
    ),
    description: t("refType.sheet.create.description"),
    children: (
      <RefTypeCreateForm
        className="mx-4"
        refTypeCallback={createRefType}
        cancelCallback={() => {
          closeCreateRefTypeSheet?.();
          resetRefType?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[30vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRefType,
  });

  return {
    createRefTypeSheet,
    openCreateRefTypeSheet,
    closeCreateRefTypeSheet,
  };
};
