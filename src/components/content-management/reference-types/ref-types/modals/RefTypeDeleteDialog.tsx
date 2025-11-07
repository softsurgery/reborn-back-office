import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface RefTypeDeleteDialogProps {
  representation?: string;
  deleteRefType?: () => void;
  isDeletionPending?: boolean;
  resetRefType?: () => void;
}

export const useRefTypeDeleteDialog = ({
  representation,
  deleteRefType,
  isDeletionPending,
  resetRefType,
}: RefTypeDeleteDialogProps) => {
  const { t } = useTranslation("content-management");

  const {
    DialogFragment: deleteRefTypeDialog,
    openDialog: openDeleteRefTypeDialog,
    closeDialog: closeDeleteRefTypeDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("refType.dialogs.delete.title")}{" "}
        <span className="font-light">{representation}</span> ?
      </div>
    ),
    description: t("refType.dialogs.delete.description"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteRefType?.();
              closeDeleteRefTypeDialog();
            }}
          >
            {t("refType.dialogs.delete.confirm")}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetRefType?.();
              closeDeleteRefTypeDialog();
            }}
          >
            {t("refType.dialogs.delete.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetRefType,
  });

  return {
    deleteRefTypeDialog,
    openDeleteRefTypeDialog,
    closeDeleteRefTypeDialog,
  };
};
