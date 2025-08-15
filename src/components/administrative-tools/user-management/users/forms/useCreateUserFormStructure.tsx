import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  ImageFieldProps,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { UserStore } from "@/hooks/stores/useUserStore";
import { Gender } from "@/types";
import { useTranslation } from "react-i18next";

interface useCreateUserFormStructureProps {
  userStore: UserStore;
  regions: SelectOption[];
  roles: SelectOption[];
}

export const useCreateUserFormStructure = ({
  userStore,
  regions,
  roles,
}: useCreateUserFormStructureProps) => {
  const { t } = useTranslation("user-management");

  //photo
  const photoField: Field<ImageFieldProps> = {
    id: "photo",
    label: t("userManagement.forms.photo"),
    variant: FieldVariant.IMAGE,
    required: true,
    description: t("userManagement.forms.photoDescription"),
    error: t(userStore.createDtoErrors?.photo?.[0]),
    props: {},
  };

  //first name
  const firstNameField: Field<TextFieldProps> = {
    id: "firstname",
    label: t("userManagement.forms.firstName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "John",
    description: t("userManagement.forms.firstNameDescription"),
    error: t(userStore.createDtoErrors?.firstName?.[0]),
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
    label: t("userManagement.forms.lastName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Doe",
    description: t("userManagement.forms.lastNameDescription"),
    error: t(userStore.createDtoErrors?.lastName?.[0]),
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
    label: t("userManagement.forms.email"),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: "john@doe.com",
    description: t("userManagement.forms.emailDescription"),
    error: t(userStore.createDtoErrors?.email?.[0]),
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
    label: t("userManagement.forms.dateOfBirth"),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "YYYY-MM-DD",
    description: t("userManagement.forms.dateOfBirthDescription"),
    error: t(userStore.createDtoErrors?.dateOfBirth?.[0]),
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
    label: t("userManagement.forms.username"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("userManagement.forms.usernamePlaceholder"),
    description: t("userManagement.forms.usernameDescription"),
    error: t(userStore.createDtoErrors?.username?.[0]),
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
    label: t("userManagement.forms.password"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.passwordPlaceholder"),
    description: t("userManagement.forms.passwordDescription"),
    error: t(userStore.createDtoErrors?.password?.[0]),
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
    label: t("userManagement.forms.confirmPassword"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.confirmPasswordPlaceholder"),
    description: t("userManagement.forms.confirmPasswordDescription"),
    error: t(userStore.createDtoErrors?.confirmPassword?.[0]),
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
    label: t("userManagement.forms.role"),
    variant: FieldVariant.SELECT,
    required: true,
    description: t("userManagement.forms.roleDescription"),
    placeholder: t("userManagement.forms.rolePlaceholder"),
    error: t(userStore.createDtoErrors?.roleId?.[0]),
    props: {
      options: roles,
      value: userStore.createDto.roleId,
      onValueChange: (value: string) => {
        userStore.setNested("createDto.roleId", value);
        userStore.setNested("createDtoErrors.roleId", []);
      },
    },
  };

  const userCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("userManagement.forms.step1Title"),
        description: "",
        includeHeader: true,
        rows: [
          { fields: [photoField] },
          {
            fields: [firstNameField, lastNameField],
          },
          {
            fields: [emailField, dateOfBirthField],
          },
        ],
      },
      {
        title: t("userManagement.forms.step2Title"),
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

  const phoneField: Field<NumberFieldProps> = {
    id: "phone",
    label: "Phone",
    variant: FieldVariant.NUMBER,
    required: false,
    placeholder: "+216 21 21 21 21",
    description: "Enter your phone number",
    error: userStore.createDtoErrors?.phone?.[0],
    props: {
      value: Number(userStore.createDto?.profile?.phone) || undefined,
      onChange: (value: number) => {
        userStore.setNested("createDto.profile.phone", value.toString());
        userStore.setNested("createDtoErrors.phone", []);
      },
    },
  };

  const cinField: Field<NumberFieldProps> = {
    id: "cin",
    label: "CIN",
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: "CIN Number",
    description: "Enter your CIN number",
    error: userStore.createDtoErrors?.cin?.[0],
    props: {
      value: Number(userStore.createDto?.profile?.cin) || undefined,
      onChange: (value: number) => {
        userStore.setNested("createDto.profile.cin", value.toString());
        userStore.setNested("createDtoErrors.cin", []);
      },
    },
  };

  const bioField: Field<TextareaFieldProps> = {
    id: "bio",
    label: "Bio",
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: "Tell us about yourself",
    description: "Enter a short bio",
    error: userStore.createDtoErrors?.bio?.[0],
    props: {
      value: userStore.createDto?.profile?.bio,
      onChange: (value) => {
        userStore.setNested("createDto.profile.bio", value);
        userStore.setNested("createDtoErrors.bio", []);
      },
      rows: 5,
    },
  };

  const genderField: Field<SelectFieldProps> = {
    id: "gender",
    label: "Gender",
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: "Select your gender",
    description: "Choose your gender",
    error: userStore.createDtoErrors?.gender?.[0],
    props: {
      options: Object.entries(Gender).map(([value, label]) => ({
        value,
        label,
      })),
      value: userStore.createDto?.profile?.gender,
      onValueChange: (value) => {
        userStore.setNested("createDto.profile.gender", value);
        userStore.setNested("createDtoErrors.gender", []);
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
    error: userStore.createDtoErrors?.isPrivate?.[0],
    props: {
      checked: userStore.createDto?.profile?.isPrivate,
      onCheckedChange: (value) => {
        userStore.setNested("createDto.profile.isPrivate", value);
        userStore.setNested("createDtoErrors.isPrivate", []);
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
    error: userStore.createDtoErrors?.regionId?.[0],
    props: {
      options: regions,
      value: userStore.createDto?.profile?.regionId?.toString(),
      onValueChange: (value) => {
        userStore.setNested("createDto.profile.regionId", Number(value));
        userStore.setNested("createDtoErrors.regionId", []);
      },
    },
  };

  const profileCreateFormStructure: FormStructure = {
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
            fields: [genderField, regionField],
          },
          {
            fields: [bioField],
          },
          {
            fields: [isPrivateField],
          },
        ],
      },
    ],
  };

  return {
    userCreateFormStructure,
    profileCreateFormStructure,
  };
};
