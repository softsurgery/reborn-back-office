import { useDialog } from "@/components/shared/Dialogs";
import { Spinner } from "@/components/shared/Spinner";
import { Button } from "@/components/ui/button";

interface RegionDeleteDialogProps {
  regionLabel?: string;
  deleteRegion?: () => void;
  isDeletePending?: boolean;
}

export const useRegionDeleteDialog = ({
  regionLabel,
  deleteRegion,
  isDeletePending,
}: RegionDeleteDialogProps) => {
  const {
    DialogFragment: deleteRegionDialog,
    openDialog: openDeleteRegionDialog,
    closeDialog: closeDeleteRegionDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete Region <span className="font-light">{regionLabel}</span> ?
      </div>
    ),
    description:
      "This action is irreversible and permanent.Please proceed with caution.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            variant={"destructive"}
            onClick={() => {
              deleteRegion?.();
              closeDeleteRegionDialog();
            }}
          >
            Delete
            <Spinner show={isDeletePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteRegionDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    deleteRegionDialog,
    openDeleteRegionDialog,
    closeDeleteRegionDialog,
  };
};
