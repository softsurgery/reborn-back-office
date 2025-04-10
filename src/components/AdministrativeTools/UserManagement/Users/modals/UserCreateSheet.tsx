import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserForm } from "../UserForm";
import { useRoles } from "@/hooks/content/useRoles";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";

interface UserCreateSheet {
  createUser?: () => void;
  isCreatePending?: boolean;
  resetUser?: () => void;
}

export const useUserCreateSheet = ({
  createUser,
  isCreatePending,
  resetUser,
}: UserCreateSheet) => {
  const { roles, isFetchRolesPending } = useRoles();
  const {
    SheetFragment: createUserSheet,
    openSheet: openCreateUserSheet,
    closeSheet: closeCreateUserSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <User />
        New User
      </div>
    ),
    description:
      "Use this form to define a new user within the system. A user is identified by their unique email address, Fill in all required fields to ensure the user is successfully added.",
    children: (
      <div>
        <UserForm className="my-4" roles={roles} />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              createUser?.();
            }}
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetUser?.();
              closeCreateUserSheet();
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
    createUserSheet,
    openCreateUserSheet,
    closeCreateUserSheet,
  };
};
