import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserForm } from "../UserForm";
import { useRoles } from "@/hooks/content/useRoles";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";

interface UserUpdateSheet {
  updateUser?: () => void;
  isUpdatePending?: boolean;
  resetUser?: () => void;
}

export const useUserUpdateSheet = ({
  updateUser,
  isUpdatePending,
  resetUser,
}: UserUpdateSheet) => {
  const { roles, isFetchRolesPending } = useRoles();
  const {
    SheetFragment: updateUserSheet,
    openSheet: openUpdateUserSheet,
    closeSheet: closeUpdateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        Update User
      </div>
    ),
    description:
      "Use this form to update an existing user within the system. A user is identified by their unique email address, Fill in all required fields to ensure the user is successfully updated.",
    children: (
      <div>
        <UserForm
          className="my-4"
          roles={roles}
          forceShowPasswordInputs={false}
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              updateUser?.();
            }}
          >
            Save
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetUser?.();
              closeUpdateUserSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetUser,
  });

  return {
    updateUserSheet,
    openUpdateUserSheet,
    closeUpdateUserSheet,
  };
};
