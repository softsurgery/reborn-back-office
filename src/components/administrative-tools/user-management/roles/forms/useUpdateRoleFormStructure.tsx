import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectOption,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { RoleStore } from "@/hooks/stores/useRoleStore";
import { PermissionAccordions } from "../PermissionAccordions";
import { ResponsePermissionDto } from "@/types";

interface RoleUpdateFormStructureProps {
  roleStore: RoleStore;
  permissions?: ResponsePermissionDto[];
}
export const useUpdateRoleFormStructure = ({
  roleStore,
  permissions,
}: RoleUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Awesome Administrator",
    description: "Role's label.",
    error: roleStore.updateDtoErrors?.label?.[0],
    props: {
      value: roleStore.updateDto.label || undefined,
      onChange: (value) => {
        roleStore.setNested("updateDto.label", value);
        roleStore.setNested("updateDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextFieldProps> = {
    id: "description",
    label: "Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: "This is awesome!",
    description: "Role's description.",
    error: roleStore.updateDtoErrors?.description?.[0],
    props: {
      value: roleStore.updateDto.description || undefined,
      onChange: (value) => {
        roleStore.setNested("updateDto.description", value);
        roleStore.setNested("updateDtoErrors.description", []);
      },
    },
  };

  const permissionsField: Field<CustomFieldProps> = {
    id: "permissions",
    label: "Permissions",
    variant: FieldVariant.CUSTOM,
    required: true,
    description: "Select the permissions for this role.",
    error: roleStore.updateDtoErrors?.permissions?.[0],
    props: {
      children: (
        <PermissionAccordions permissions={permissions} type="update" />
      ),
    },
  };

  const roleUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Update Role",
        description: "Update a new role with the specified permissions.",
        rows: [
          {
            fields: [labelField],
          },
          {
            fields: [descriptionField],
          },
          {
            fields: [permissionsField],
          },
        ],
      },
    ],
  };

  return {
    roleUpdateFormStructure,
  };
};
