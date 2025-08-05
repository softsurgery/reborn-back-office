import {
  CheckboxFieldProps,
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
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

interface useUpdateUserFormStructureProps {
  userStore: UserStore;
  regions: SelectOption[];
  roles: SelectOption[];
}

export const useUpdateUserFormStructure = ({
  userStore,
  regions,
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
    description: `${tUser(
      "userManagement.forms.requirePasswordCheckDescription"
    )}`,
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

  const userUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: `${tUser("userManagement.forms.step1FieldTitle")}`,
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
        title: `${tUser("userManagement.forms.step1Title")}`,
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

  const phoneField: Field<NumberFieldProps> = {
    id: "phone",
    label: `${tUser("userManagement.forms.phone")}`,
    variant: FieldVariant.NUMBER,
    required: false,
    placeholder: `${tUser("userManagement.forms.phonePlaceholder")}`,
    description: `${tUser("userManagement.forms.phoneDescription")}`,
    error: userStore.updateDtoErrors?.phone?.[0],
    props: {
      value: Number(userStore.updateDto?.profile?.phone) || undefined,
      onChange: (value: number) => {
        userStore.setNested("updateDto.profile.phone", value.toString());
        userStore.setNested("updateDtoErrors.phone", []);
      },
    },
  };

  const cinField: Field<NumberFieldProps> = {
    id: "cin",
    label: `${tUser("userManagement.forms.CIN")}`,
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: `${tUser("userManagement.forms.CINPlaceholder")}`,
    description: `${tUser("userManagement.forms.CINDescription")}`,
    error: userStore.updateDtoErrors?.cin?.[0],
    props: {
      value: Number(userStore.updateDto?.profile?.cin) || undefined,
      onChange: (value: number) => {
        userStore.setNested("updateDto.profile.cin", value.toString());
        userStore.setNested("updateDtoErrors.cin", []);
      },
    },
  };

  const bioField: Field<TextareaFieldProps> = {
    id: "bio",
    label: `${tUser("userManagement.forms.bio")}`,
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: `${tUser("userManagement.forms.bioPlaceholder")}`,
    description: `${tUser("userManagement.forms.bioDescription")}`,
    error: userStore.updateDtoErrors?.bio?.[0],
    props: {
      value: userStore.updateDto?.profile?.bio,
      onChange: (value) => {
        userStore.setNested("updateDto.profile.bio", value);
        userStore.setNested("updateDtoErrors.bio", []);
      },
      rows: 5,
    },
  };

  const genderField: Field<SelectFieldProps> = {
    id: "gender",
    label: `${tUser("userManagement.forms.gender")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${tUser("userManagement.forms.genderPlaceholder")}`,
    description: `${tUser("userManagement.forms.genderDescription")}`,
    error: userStore.updateDtoErrors?.gender?.[0],
    props: {
      options: Object.entries(Gender).map(([value, label]) => ({
        value,
        label,
      })),
      value: userStore.updateDto?.profile?.gender?.toString(),
      onValueChange: (value) => {
        userStore.setNested("updateDto.profile.gender", value as Gender);
        userStore.setNested("updateDtoErrors.gender", []);
      },
    },
  };

  const isPrivateField: (defaultChecked: boolean) => Field<SwitchFieldProps> = (
    defaultChecked
  ) => ({
    id: "isPrivate",
    label: `${tUser("userManagement.forms.isPrivate")}`,
    variant: FieldVariant.SWITCH,
    required: true,
    placeholder: `${tUser("userManagement.forms.isPrivatePlaceholder")}`,
    description: `${tUser("userManagement.forms.isPrivateDescription")}`,
    props: {
      defaultChecked,
      checked: userStore.updateDto?.profile?.isPrivate,
      onCheckedChange: (value) => {
        userStore.setNested("updateDto.profile.isPrivate", value);
        userStore.setNested("updateDtoErrors.isPrivate", []);
      },
    },
  });

  const regionField: Field<SelectFieldProps> = {
    id: "region",
    label: `${tUser("userManagement.forms.region")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${tUser("userManagement.forms.regionPlaceholder")}`,
    description: `${tUser("userManagement.forms.regionDescription")}`,
    error: userStore.updateDtoErrors?.regionId?.[0],
    props: {
      options: regions,
      value: userStore.updateDto?.profile?.regionId?.toString(),
      onValueChange: (value) => {
        userStore.setNested("updateDto.profile.regionId", Number(value));
        userStore.setNested("updateDtoErrors.regionId", []);
      },
    },
  };

  const profileUpdateFormStructure: FormStructure = {
    title: `${tUser("userManagement.forms.step2Title")}`,
    description: `${tUser("userManagement.forms.step2Description")}`,
    orientation: "horizontal",
    fieldsets: [
      {
        title: `${tUser("userManagement.forms.step2FieldTitle")}`,
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
            fields: [isPrivateField(!!userStore.updateDto?.profile?.isPrivate)],
          },
        ],
      },
    ],
  };

  return {
    userUpdateFormStructure,
    profileUpdateFormStructure,
  };
};
