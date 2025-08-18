import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

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
  resetFeedback
}: FeedbackDeleteDialogProps) => {
  const {
    DialogFragment: deleteFeedbackDialog,
    openDialog: openDeleteFeedbackDialog,
    closeDialog: closeDeleteFeedbackDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Feedback <span className="font-light">{feedbackMessage}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteFeedback?.();
              closeDeleteFeedbackDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetFeedback?.();
              closeDeleteFeedbackDialog();
            }}
          >
            Cancel
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
