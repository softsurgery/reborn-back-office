import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface EducationDeleteDialogProps {
  educationTitle?: string;
  deleteEducation?: () => void;
  isDeletePending?: boolean;
}

export const useEducationDeleteDialog = ({
  educationTitle,
  deleteEducation,
  isDeletePending,
}: EducationDeleteDialogProps) => {
  const { t } = useTranslation("user-management");
  const { t: tCommon } = useTranslation("common");
  const {
    DialogFragment: educationDeleteDialog,
    openDialog: openEducationDeleteDialog,
    closeDialog: closeEducationDeleteDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        {t("userManagement.inspect.career.education.dialogs.deleteTitle")}{" "}
        <span className="font-light">{educationTitle}</span> ?
      </div>
    ),
    description: (
      <div>
        {t("userManagement.inspect.career.education.dialogs.deleteDescription")}
      </div>
    ),
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteEducation?.();
              closeEducationDeleteDialog();
            }}
          >
            {tCommon("common.buttons.delete")}
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeEducationDeleteDialog();
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
    educationDeleteDialog,
    openEducationDeleteDialog,
    closeEducationDeleteDialog,
  };
};
