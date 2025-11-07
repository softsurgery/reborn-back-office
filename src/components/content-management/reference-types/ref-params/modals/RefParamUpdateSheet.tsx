import { Table2 } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";
import { RefParamUpdateForm } from "../forms/RefParamUpdateForm";

interface RefParamUpdateSheet {
  updateRefParam?: () => void;
  isUpdatePending?: boolean;
  resetRefParam?: () => void;
}

export const useRefParamUpdateSheet = ({
  updateRefParam,
  isUpdatePending,
  resetRefParam,
}: RefParamUpdateSheet) => {
  const { t } = useTranslation("content-management");

  const {
    SheetFragment: updateRefParamSheet,
    openSheet: openUpdateRefParamSheet,
    closeSheet: closeUpdateRefParamSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Table2 />
        {t("refParam.sheet.update.title")}
      </div>
    ),
    description: t("refParam.sheet.update.description"),
    children: (
      <RefParamUpdateForm
        className="mx-4"
        refParamCallback={updateRefParam}
        cancelCallback={() => {
          closeUpdateRefParamSheet?.();
          resetRefParam?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[50vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRefParam,
  });

  return {
    updateRefParamSheet,
    openUpdateRefParamSheet,
    closeUpdateRefParamSheet,
  };
};
