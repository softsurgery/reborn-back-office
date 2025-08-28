import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface JobCategoryDeleteDialogProps {
  jobCategoryLabel?: string;
  deleteJobCategory?: () => void;
  isDeletePending?: boolean;
}

export const useJobCategoryDeleteDialog = ({
  jobCategoryLabel,
  deleteJobCategory,
  isDeletePending,
}: JobCategoryDeleteDialogProps) => {
  const { t: tJob } = useTranslation("job");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: deleteJobCategoryDialog,
    openDialog: openDeleteJobCategoryDialog,
    closeDialog: closeDeleteJobCategoryDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {tJob("jobCategory.dialog.deleteTitle")}{" "}
        <span className="font-light">{jobCategoryLabel}</span> ?
      </div>
    ),
    description: tJob("jobCategory.dialog.deleteDescription"),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteJobCategory?.();
              closeDeleteJobCategoryDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteJobCategoryDialog();
            }}
          >
            {tCommon("common.buttons.cancel")}
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    deleteJobCategoryDialog,
    openDeleteJobCategoryDialog,
    closeDeleteJobCategoryDialog,
  };
};
