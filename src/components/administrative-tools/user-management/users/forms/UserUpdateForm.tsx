import React from "react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/hooks/stores/useUserStore";
import { useRoles } from "@/hooks/content/useRoles";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { mapToSelectOptions } from "@/components/shared/form-builder/utils/mapToSelectOptions";
import { Button } from "@/components/ui/button";
import { useUpdateUserFormStructure } from "./useUpdateFormStructure";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserUpdateFormProps {
  className?: string;
  userCallback?: () => void;
  cancelCallback?: () => void;
  isPending?: boolean;
}

export const UserUpdateForm: React.FC<UserUpdateFormProps> = ({
  className,
  userCallback,
  cancelCallback,
  isPending,
}) => {
  const { t: tCommon } = useTranslation("common");
  const userStore = useUserStore();
  const { roles, isFetchRolesPending } = useRoles();
  const { userFormStructure } = useUpdateUserFormStructure({
    userStore,
    roles: mapToSelectOptions({
      data: isFetchRolesPending ? [] : roles,
      labelKey: "label",
      valueKey: "id",
    }),
  });

  return (
    <div
      className={cn("flex flex-col flex-1 overflow-hidden gap-2", className)}
    >
      <FormBuilder
        className="mx-auto mt-5 px-2 h-full flex flex-col flex-1 overflow-auto"
        structure={userFormStructure}
      />
      <div className="flex gap-2 justify-end px-4 py-3 border-t">
        <Button
          onClick={() => {
            userCallback?.();
          }}
          disabled={isPending}
        >
          <Save />
          {tCommon('common.buttons.update')}
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => {
            cancelCallback?.();
          }}
          disabled={isPending}
        >
          {tCommon('common.buttons.cancel')}
        </Button>
      </div>
    </div>
  );
};
