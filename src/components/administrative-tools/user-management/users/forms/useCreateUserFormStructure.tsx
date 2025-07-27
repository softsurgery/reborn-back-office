import {
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

interface useCreateUserFormStructureProps {
  userStore: UserStore;
  roles: SelectOption[];
}

export const useCreateUserFormStructure = ({
  userStore,
  roles,
}: useCreateUserFormStructureProps) => {
  const { t: tUser } = useTranslation("user-management");
  //first name
  const firstNameField: Field<TextFieldProps> = {
    id: "firstname",
    label: tUser("userManagement.forms.firstName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "John",
    description: tUser("userManagement.forms.firstNameDescription"),
    error: tUser(userStore.createDtoErrors?.firstName?.[0]),
    props: {
      value: userStore.createDto.firstName || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.firstName", value);
        userStore.setNested("createDtoErrors.firstName", []);
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
    error: tUser(userStore.createDtoErrors?.lastName?.[0]),
    props: {
      value: userStore.createDto.lastName || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.lastName", value);
        userStore.setNested("createDtoErrors.lastName", []);
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
    error: tUser(userStore.createDtoErrors?.email?.[0]),
    props: {
      value: userStore.createDto.email || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.email", value);
        userStore.setNested("createDtoErrors.email", []);
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
    error: tUser(userStore.createDtoErrors?.dateOfBirth?.[0]),
    props: {
      value: userStore.createDto.dateOfBirth || undefined,
      onDateChange: (value: Date | null) => {
        userStore.setNested("createDto.dateOfBirth", value?.toISOString());
        userStore.setNested("createDtoErrors.dateOfBirth", []);
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
    error: tUser(userStore.createDtoErrors?.username?.[0]),
    props: {
      value: userStore.createDto.username || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.username", value);
        userStore.setNested("createDtoErrors.username", []);
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
    error: tUser(userStore.createDtoErrors?.password?.[0]),
    props: {
      value: userStore.createDto.password || undefined,
      onChange: (value) => {
        userStore.setNested("createDto.password", value);
        userStore.setNested("createDtoErrors.password", []);
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
    error: tUser(userStore.createDtoErrors?.confirmPassword?.[0]),
    props: {
      value: userStore.confirmPassword || undefined,
      onChange: (value) => {
        userStore.set("confirmPassword", value);
        userStore.setNested("createDtoErrors.confirmPassword", []);
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
    error: tUser(userStore.createDtoErrors?.roleId?.[0]),
    props: {
      options: roles,
      value: userStore.createDto.roleId,
      onValueChange: (value: string) => {
        userStore.setNested("createDto.roleId", value);
        userStore.setNested("createDtoErrors.roleId", []);
      },
    },
  };

  const userFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: tUser("userManagement.forms.step1Title"),
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
        title: tUser("userManagement.forms.step2Title"),
        description: "",
        includeHeader: true,
        rows: [
          {
            fields: [usernameField, roleField],
          },
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
