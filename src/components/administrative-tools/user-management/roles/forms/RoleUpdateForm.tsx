import React, { use } from "react";
import { cn } from "@/lib/utils";
import { useRoleStore } from "@/hooks/stores/useRoleStore";
import { useUpdateRoleFormStructure } from "./useUpdateRoleFormStructure";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { usePermissions } from "@/hooks/content/usePermissions";

interface RoleFormProps {
  className?: string;
  roleCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const RoleUpdateForm: React.FC<RoleFormProps> = ({
  className,
  roleCallback,
  cancelCallback,
  isPending,
}) => {
  const roleStore = useRoleStore();
  const { permissions } = usePermissions();
  const { roleUpdateFormStructure } = useUpdateRoleFormStructure({
    roleStore,
    permissions: permissions,
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={roleUpdateFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            roleCallback?.();
          }}
          disabled={isPending}
        >
          <Save />
          Save
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            cancelCallback?.();
          }}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
