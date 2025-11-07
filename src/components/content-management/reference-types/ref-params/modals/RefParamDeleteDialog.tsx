import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface RefParamDeleteDialogProps {
  representation?: string;
  deleteRefParam?: () => void;
  isDeletionPending?: boolean;
  resetRefParam?: () => void;
}

export const useRefParamDeleteDialog = ({
  representation,
  deleteRefParam,
  isDeletionPending,
  resetRefParam,
}: RefParamDeleteDialogProps) => {
  const { t } = useTranslation("content-management");

  const {
    DialogFragment: deleteRefParamDialog,
    openDialog: openDeleteRefParamDialog,
    closeDialog: closeDeleteRefParamDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("refParam.dialogs.delete.title")}{" "}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t("refParam.dialogs.delete.description"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteRefParam?.();
              closeDeleteRefParamDialog();
            }}
          >
            {t("refParam.dialogs.delete.confirm")}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetRefParam?.();
              closeDeleteRefParamDialog();
            }}
          >
            {t("refParam.dialogs.delete.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetRefParam,
  });

  return {
    deleteRefParamDialog,
    openDeleteRefParamDialog,
    closeDeleteRefParamDialog,
  };
};
