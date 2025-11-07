import { Table2 } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";
import { RefParamCreateForm } from "../forms/RefParamCreateForm";

interface RefParamCreateSheet {
  createRefParam?: () => void;
  isCreatePending?: boolean;
  resetRefParam?: () => void;
}

export const useRefParamCreateSheet = ({
  createRefParam,
  isCreatePending,
  resetRefParam,
}: RefParamCreateSheet) => {
  const { t } = useTranslation("content-management");

  const {
    SheetFragment: createRefParamSheet,
    openSheet: openCreateRefParamSheet,
    closeSheet: closeCreateRefParamSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Table2 />
        {t("refParam.sheet.create.title")}
      </div>
    ),
    description: t("refParam.sheet.create.description"),
    children: (
      <RefParamCreateForm
        className="mx-4"
        refParamCallback={createRefParam}
        cancelCallback={() => {
          closeCreateRefParamSheet?.();
          resetRefParam?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRefParam,
  });

  return {
    createRefParamSheet,
    openCreateRefParamSheet,
    closeCreateRefParamSheet,
  };
};
