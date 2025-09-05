import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  ImageFieldProps,
  ImageFile,
  ImageGalleryFieldProps,
  NumberFieldProps,
  PasswordFieldProps,
  SelectFieldProps,
  SelectOption,
  SwitchFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { UserStore } from "@/hooks/stores/useUserStore";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { identifyUserAvatar } from "@/lib/user.utils";
import { Gender } from "@/types";
import { useTranslation } from "react-i18next";

interface useCreateUserFormStructureProps {
  userStore: UserStore;
  regions: SelectOption[];
  roles: SelectOption[];

  uploadProfilePicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isProfilePictureUploadPending?: boolean;

  uploadPhotos: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isPhotosUploadPending?: boolean;
}

export const useCreateUserFormStructure = ({
  userStore,
  regions,
  roles,
  uploadProfilePicture,
  isProfilePictureUploadPending,

  uploadPhotos,
  isPhotosUploadPending,
}: useCreateUserFormStructureProps) => {
  const { t } = useTranslation("user-management");

  //photo
  const photoField: Field<ImageFieldProps> = {
    id: "photo",
    label: t("userManagement.forms.photo"),
    variant: FieldVariant.IMAGE,
    className: "bg-muted border-2 w-40 h-40 my-2",
    wrapperClassName: "flex flex-col gap-2 items-center",
    required: true,
    description: t("userManagement.forms.photoDescription"),
    error: t(userStore.createDtoErrors?.photo?.[0]),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      placeholder: "/unknown-user.jpg",
      disabled: isProfilePictureUploadPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set("picture", value);
        userStore.setNested("createDtoErrors.pictureId", []);
      },
      onUpload: (file, onProgress) => {
        userStore.set("progress", 0);
        uploadProfilePicture({
          files: [file],
          onProgress: (progress: number) => {
            userStore.set("progress", progress);
            onProgress(progress);
          },
        });
      },
    },
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
    label: `${t("userManagement.forms.phone")}`,
    variant: FieldVariant.NUMBER,
    required: false,
    placeholder: "+216 21 21 21 21",
    description: `${t("userManagement.forms.phoneDescription")}`,
    error: t(userStore.createDtoErrors?.phone?.[0]),
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
    label: `${t("userManagement.forms.CIN")}`,
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: `${t("userManagement.forms.CINPlaceholder")}`,
    description: `${t("userManagement.forms.CINDescription")}`,
    error: t(userStore.createDtoErrors?.cin?.[0]),
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
    label: `${t("userManagement.forms.bio")}`,
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: `${t("userManagement.forms.bioPlaceholder")}`,
    description: `${t("userManagement.forms.bioDescription")}`,
    error: t(userStore.createDtoErrors?.bio?.[0]),
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
    label: `${t("userManagement.forms.gender")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${t("userManagement.forms.genderPlaceholder")}`,
    description: `${t("userManagement.forms.genderDescription")}`,
    error: t(userStore.createDtoErrors?.gender?.[0]),
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
    label: `${t("userManagement.forms.isPrivate")}`,
    variant: FieldVariant.SWITCH,
    required: true,
    placeholder: `${t("userManagement.forms.isPrivatePlaceholder")}`,
    description: `${t("userManagement.forms.isPrivateDescription")}`,
    error: t(userStore.createDtoErrors?.isPrivate?.[0]),
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
    label: `${t("userManagement.forms.region")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${t("userManagement.forms.regionPlaceholder")}`,
    description: `${t("userManagement.forms.regionDescription")}`,
    error: t(userStore.createDtoErrors?.regionId?.[0]),
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

  const uploadsField: Field<ImageGalleryFieldProps> = {
    id: "uploads",
    label: `${t("userManagement.forms.uploadsLabel")}`,
    description: `${t("userManagement.forms.uploadsDescription")}`,
    variant: FieldVariant.IMAGE_GALLERY,
    props: {
      images: userStore.images,
      disabled: isPhotosUploadPending,
      onFilesChange: (e: ImageFile[]) => {
        console.log(e);
        userStore.updateImages("create", e);
        console.log(userStore.images);
        console.log(userStore.createDto?.profile?.uploads);
      },
      onUpload: (file, onProgress) => {
        uploadPhotos({
          files: [file],
          onProgress: (progress: number) => {
            userStore.setImageProgress(file, progress);
            onProgress(progress);
          },
        });
      },
    },
  };

  const uploadsFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("userManagement.forms.step3Title"),
        rows: [{ fields: [uploadsField] }],
      },
    ],
  };

  return {
    userCreateFormStructure,
    profileCreateFormStructure,
    uploadsFormStructure,
  };
};
