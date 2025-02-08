import { BookUser } from "lucide-react";
import { useSheet } from "@/components/Common/Sheets";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Common/Spinner";
import { RoleForm } from "../RoleForm";
import { usePermissions } from "@/hooks/content/usePermissions";

interface RoleCreateSheet {
  createRole?: () => void;
  isCreatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleCreateSheet = ({
  createRole,
  isCreatePending,
  resetRole,
}: RoleCreateSheet) => {
  const { permissions, isFetchPermissionsPending } = usePermissions();

  const {
    SheetFragment: createRoleSheet,
    openSheet: openCreateRoleSheet,
    closeSheet: closeCreateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        New Role
      </div>
    ),
    description:
      "Use this form to define a new role within the system. A role determines the access level and permissions granted to users assigned to it.",
    children: (
      <div>
        <RoleForm className="my-4" permissions={permissions} />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              createRole?.();
            }}
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeCreateRoleSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetRole,
  });

  return {
    createRoleSheet,
    openCreateRoleSheet,
    closeCreateRoleSheet,
  };
};
