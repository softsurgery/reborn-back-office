import {
  CheckboxFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { UserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";

interface useUpdateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];
}

export const useUpdateUserFormStructure = ({
  userStore,
  roles,
}: useUpdateUserFormStructureProps) => {
  const { t: tUser } = useTranslation("user-management");
  //first name
  const firstNameField: Field<TextFieldProps> = {
    id: "firstname",
    label: tUser("userManagement.forms.firstName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "John",
    description: tUser("userManagement.forms.firstNameDescription"),
    error: userStore.updateDtoErrors?.firstName?.[0],
    props: {
      value: userStore.updateDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.firstName", value);
        userStore.setNested("updateDtoErrors.firstName", []);
      },
    },
  };

  //last name
  const lastNameField: Field<TextFieldProps> = {
    id: "lastname",
    label: tUser("userManagement.forms.lastName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Doe",
    description: tUser("userManagement.forms.lastNameDescription"),
    error: userStore.updateDtoErrors?.lastName?.[0],
    props: {
      value: userStore.updateDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.lastName", value);
        userStore.setNested("updateDtoErrors.lastName", []);
      },
    },
  };

  //email
  const emailField: Field<TextFieldProps> = {
    id: "email",
    label: tUser("userManagement.forms.email"),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: "john@doe.com",
    description: tUser("userManagement.forms.emailDescription"),
    error: userStore.updateDtoErrors?.email?.[0],
    props: {
      value: userStore.updateDto.email || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.email", value);
        userStore.setNested("updateDtoErrors.email", []);
      },
    },
  };

  //date of birth
  const dateOfBirthField: Field<DateFieldProps> = {
    id: "dateofbirth",
    label: tUser("userManagement.forms.dateOfBirth"),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "YYYY-MM-DD",
    description: tUser("userManagement.forms.dateOfBirthDescription"),
    error: userStore.updateDtoErrors?.dateOfBirth?.[0],
    props: {
      value: userStore.updateDto.dateOfBirth || undefined,
      onDateChange: (value) => {
        userStore.setNested("updateDto.dateOfBirth", value?.toISOString());
        userStore.setNested("updateDtoErrors.dateOfBirth", []);
      },
      nullable: true,
    },
  };

  //username
  const usernameField: Field<TextFieldProps> = {
    id: "username",
    label: tUser("userManagement.forms.username"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: tUser("userManagement.forms.usernamePlaceholder"),
    description: tUser("userManagement.forms.usernameDescription"),
    error: userStore.updateDtoErrors?.username?.[0],
    props: {
      value: userStore.updateDto.username || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.username", value);
        userStore.setNested("updateDtoErrors.username", []);
      },
    },
  };

  const checkPasswordField: Field<CheckboxFieldProps> = {
    id: "checkpassword",
    label: `${tUser("userManagement.forms.requirePasswordCheckTitle")}`,
    variant: FieldVariant.CHECK,
    required: true,
    description: `${tUser("userManagement.forms.requirePasswordCheckDescription")}`,
    props: {
      checked: userStore.setManualPassword,
      onCheckedChange: (e) => {
        userStore.set("setManualPassword", !!e);
      },
    },
  };

  //password
  const passwordField: Field<PasswordFieldProps> = {
    id: "password",
    label: tUser("userManagement.forms.password"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: tUser("userManagement.forms.passwordPlaceholder"),
    description: tUser("userManagement.forms.passwordDescription"),
    error: userStore.updateDtoErrors?.password?.[0],
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.updateDto.password || undefined,
      onChange: (value) => {
        userStore.setNested("updateDto.password", value);
        userStore.setNested("updateDtoErrors.password", []);
      },
    },
  };

  //confirm password
  const confirmPasswordField: Field<PasswordFieldProps> = {
    id: "confirmpassword",
    label: tUser("userManagement.forms.confirmPassword"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: tUser("userManagement.forms.confirmPasswordPlaceholder"),
    description: tUser("userManagement.forms.confirmPasswordDescription"),
    error: userStore.updateDtoErrors?.confirmPassword?.[0],
    hidden: !userStore.setManualPassword,
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set("confirmPassword", value);
        userStore.setNested("updateDtoErrors.confirmPassword", []);
      },
    },
  };

  //roles
  const roleField: Field<SelectFieldProps> = {
    id: "role",
    label: tUser("userManagement.forms.role"),
    variant: FieldVariant.SELECT,
    required: true,
    description: tUser("userManagement.forms.roleDescription"),
    placeholder: tUser("userManagement.forms.rolePlaceholder"),
    error: userStore.updateDtoErrors.roleId?.[0],
    props: {
      options: roles,
      value: userStore.updateDto.roleId,
      onValueChange: (value: string) => {
        userStore.setNested("updateDto.roleId", value);
        userStore.setNested("updateDtoErrors.roleId", []);
      },
    },
  };

  const userFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "General Information",
        description: "",
        includeHeader: true,
        rows: [
          {
            fields: [firstNameField, lastNameField],
          },
          {
            fields: [emailField, dateOfBirthField],
          },
        ],
      },
      {
        title: "Account Information",
        description: "",
        includeHeader: true,
        rows: [
          {
            fields: [usernameField, roleField],
          },
          { fields: [checkPasswordField] },
          {
            fields: [passwordField, confirmPasswordField],
          },
        ],
      },
    ],
  };

  return {
    userFormStructure,
  };
};
