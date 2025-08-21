import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface BugDeleteDialogProps {
  bugMessage?: string;
  deleteBug?: () => void;
  isDeletionPending?: boolean;
  resetBug?: () => void;
}

export const useBugDeleteDialog = ({
  bugMessage,
  deleteBug,
  isDeletionPending,
  resetBug,
}: BugDeleteDialogProps) => {
  const { t } = useTranslation("bug");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteBugDialog,
    openDialog: openDeleteBugDialog,
    closeDialog: closeDeleteBugDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("bug.dialog.title")} <span className="font-light">{bugMessage}</span> ?
      </div>
    ),
    description: t("bug.dialog.description"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteBug?.();
              closeDeleteBugDialog();
            }}
          >
            {tCommon("common.buttons.confirm")}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetBug?.();
              closeDeleteBugDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetBug,
  });

  return {
    deleteBugDialog,
    openDeleteBugDialog,
    closeDeleteBugDialog,
  };
};
