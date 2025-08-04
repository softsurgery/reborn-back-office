import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ProfileStore } from "@/hooks/stores/useProfileStore";
import { UserStore } from "@/hooks/stores/useUserStore";
import { useTranslation } from "react-i18next";

interface useCreateUserFormStructureProps {
  userStore: UserStore;
  profileStore: ProfileStore;
  regions: SelectOption[];
  roles: SelectOption[];
}

export const useCreateUserFormStructure = ({
  userStore,
  profileStore,
  regions,
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
// Profile Form Structure

const phoneField: Field<TextFieldProps> = {
  id: "phone",
  label: "Phone",
  variant: FieldVariant.NUMBER,
  required: true,
  placeholder: "123-456-7890",
  description: "Enter your phone number",
  error: profileStore.createDtoErrors?.phone?.[0],
  props: {
    value: profileStore.createDto.phone || undefined,
    onChange: (value) => {
      profileStore.setNested("createDto.phone", value);
      profileStore.setNested("createDtoErrors.phone", []);
    },
  },
};

const cinField: Field<TextFieldProps> = {
  id: "cin",
  label: "CIN",
  variant: FieldVariant.NUMBER,
  required: true,
  placeholder: "CIN Number",
  description: "Enter your CIN number",
  error: profileStore.createDtoErrors?.cin?.[0],
  props: {
    value: profileStore.createDto.cin || undefined,
    onChange: (value) => {
      profileStore.setNested("createDto.cin", value);
      profileStore.setNested("createDtoErrors.cin", []);
    },
  },
};

const bioField: Field<TextFieldProps> = {
  id: "bio",
  label: "Bio",
  variant: FieldVariant.TEXTAREA,
  required: false,
  placeholder: "Tell us about yourself",
  description: "Enter a short bio",
  error: profileStore.createDtoErrors?.bio?.[0],
  props: {
    value: profileStore.createDto.bio || undefined,
    onChange: (value) => {
      profileStore.setNested("createDto.bio", value);
      profileStore.setNested("createDtoErrors.bio", []);
    },
  },
};

const genderField: Field<SelectFieldProps> = {
  id: "gender",
  label: "Gender",
  variant: FieldVariant.SELECT,
  required: true,
  placeholder: "Select your gender",
  description: "Choose your gender",
  error: profileStore.createDtoErrors?.gender?.[0],
  props: {
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
    value: profileStore.createDto.gender || undefined,
    onValueChange: (value) => {
      profileStore.setNested("createDto.gender", value);
      profileStore.setNested("createDtoErrors.gender", []);
    },
  },
};

const isPrivateField: Field<SwitchFieldProps> = {
  id: "isPrivate",
  label: "Profile Privacy",
  variant: FieldVariant.SWITCH,
  required: true,
  placeholder: "Select privacy setting",
  description: "Choose whether your profile is private or public",
  error: profileStore.createDtoErrors?.isPrivate?.[0],
  props: {
    checked: profileStore.createDto.isPrivate || false,
    onCheckedChange: (value) => {
      profileStore.setNested("createDto.isPrivate", value);
      profileStore.setNested("createDtoErrors.isPrivate", []);
    },
  },
};

const regionField: Field<SelectFieldProps> = {
  id: "region",
  label: "Region",
  variant: FieldVariant.SELECT,
  required: false,
  placeholder: "Select your region",
  description: "Choose your region",
  error: profileStore.createDtoErrors?.regionId?.[0],
  props: {
    options: regions,
    value: profileStore.createDto.regionId?.toString() || undefined,
    onValueChange: (value) => {
      profileStore.setNested("createDto.regionId", value);
      profileStore.setNested("createDtoErrors.regionId", []);
    },
  },
};

  const profileFormStructure: FormStructure = {
    title: "Profile Information",
    description: "Please fill out your profile details",
    orientation: "horizontal",
    fieldsets: [
      {
        title: "Profile Details",
        description: "",
        includeHeader: true,
        rows: [
          {
            fields: [phoneField, cinField],
          },
          {
            fields: [bioField, genderField],
          },
          {
            fields: [isPrivateField, regionField],
          },
        ],
      },
    ],
  };

return {
    userFormStructure,
    profileFormStructure,
  };
};
