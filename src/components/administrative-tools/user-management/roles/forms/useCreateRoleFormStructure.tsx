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

interface RoleCreateFormStructureProps {
  roleStore: RoleStore;
  permissions?: ResponsePermissionDto[];

}
export const useCreateRoleFormStructure = ({
  roleStore,
  permissions,
}: RoleCreateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Awesome Administrator",
    description: "Role's label.",
    error: roleStore.createDtoErrors?.label?.[0],
    props: {
      value: roleStore.createDto.label || undefined,
      onChange: (value) => {
        roleStore.setNested("createDto.label", value);
        roleStore.setNested("createDtoErrors.label", []);
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
    error: roleStore.createDtoErrors?.description?.[0],
    props: {
      value: roleStore.createDto.description || undefined,
      onChange: (value) => {
        roleStore.setNested("createDto.description", value);
        roleStore.setNested("createDtoErrors.description", []);
      },
    },
  };

  const permissionsField: Field<CustomFieldProps> = {
    id: "permissions",
    label: "Permissions",
    variant: FieldVariant.CUSTOM,
    required: true,
    description: "Select the permissions for this role.",
    error: roleStore.createDtoErrors?.permissions?.[0],
    props: {
      children: (
        <PermissionAccordions permissions={permissions} type="create" />
      ),
    },
  };

  const roleCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Create Role",
        description: "Create a new role with the specified permissions.",
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
    roleCreateFormStructure,
  };
};
