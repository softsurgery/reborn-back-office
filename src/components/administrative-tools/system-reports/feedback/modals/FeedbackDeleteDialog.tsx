import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface FeedbackDeleteDialogProps {
  feedbackMessage?: string;
  deleteFeedback?: () => void;
  isDeletionPending?: boolean;
  resetFeedback?: () => void;
}

export const useFeedbackDeleteDialog = ({
  feedbackMessage,
  deleteFeedback,
  isDeletionPending,
  resetFeedback,
}: FeedbackDeleteDialogProps) => {
  const { t } = useTranslation("feedback");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteFeedbackDialog,
    openDialog: openDeleteFeedbackDialog,
    closeDialog: closeDeleteFeedbackDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("feedback.dialog.title")}{" "}
        <span className="font-light">{feedbackMessage}</span> ?
      </div>
    ),
    description: t("feedback.dialog.description"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteFeedback?.();
              closeDeleteFeedbackDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetFeedback?.();
              closeDeleteFeedbackDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetFeedback,
  });

  return {
    deleteFeedbackDialog,
    openDeleteFeedbackDialog,
    closeDeleteFeedbackDialog,
  };
};
