import { BookUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleForm } from "../RoleForm";
import { usePermissions } from "@/hooks/content/usePermissions";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";


interface RoleUpdateSheet {
  updateRole?: () => void;
  isUpdatePending?: boolean;
  resetRole?: () => void;
}

export const useRoleUpdateSheet = (
  { updateRole, isUpdatePending, resetRole }: RoleUpdateSheet
) => {
  const { permissions, isFetchPermissionsPending } = usePermissions();
  const {
    SheetFragment: updateRoleSheet,
    openSheet: openUpdateRoleSheet,
    closeSheet: closeUpdateRoleSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <BookUser />
        Update Role
      </div>
    ),
    description:
      "Use this form to update role within the system. A role determines the access level and permissions granted to users assigned to it.",
    children: (
      <div>
        <RoleForm className="my-4" permissions={permissions} />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              updateRole?.();
            }}
          >
            Update
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeUpdateRoleSheet();
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
    updateRoleSheet,
    openUpdateRoleSheet,
    closeUpdateRoleSheet,
  };
};
