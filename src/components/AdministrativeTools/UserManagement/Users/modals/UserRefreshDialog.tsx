import { useDialog } from "@/components/Common/Dialogs";
import { Spinner } from "@/components/Common/Spinner";
import { Button } from "@/components/ui/button";

interface UserRefreshDialogProps {
  representation?: string;
  refreshUser?: () => void;
  isRefreshPending?: boolean;
  resetUser?: () => void;
}

export const useRefreshUserDialog = ({
  representation,
  refreshUser,
  isRefreshPending,
  resetUser,
}: UserRefreshDialogProps) => {
  const {
    DialogFragment: refreshUserDialog,
    openDialog: openRefreshUserDialog,
    closeDialog: closeRefreshUserDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Refresh User <span className="font-light">{representation}</span> ?
      </div>
    ),
    description:
      "This action will refresh the user and ensure their API key is up-to-date.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              refreshUser?.();
              closeRefreshUserDialog();
            }}
          >
            Refresh
            <Spinner show={isRefreshPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeRefreshUserDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetUser,
  });

  return {
    refreshUserDialog,
    openRefreshUserDialog,
    closeRefreshUserDialog,
  };
};
