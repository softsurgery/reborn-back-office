import {
  CheckboxFieldProps,
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

interface useUpdateUserFormStructureProps {
  userStore: UserStore;
  regions: SelectOption[];
  roles: SelectOption[];

  uploadProfilePicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isProfilePictureUploadPending?: boolean;

  uploadOfficialDocument: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isOfficialDocumentUploadPending?: boolean;

  uploadDriverLicenseDocument: ReturnType<
    typeof useUploadMutation
  >["uploadFiles"];
  isDriverLicenseDocumentPending?: boolean;

  uploadPhotos: ReturnType<typeof useUploadMutation>["uploadFiles"];
  isPhotosUploadPending?: boolean;
}

export const useUpdateUserFormStructure = ({
  userStore,
  regions,
  roles,

  uploadProfilePicture,
  isProfilePictureUploadPending,

  uploadOfficialDocument,
  isOfficialDocumentUploadPending,

  uploadDriverLicenseDocument,
  isDriverLicenseDocumentPending,

  uploadPhotos,
  isPhotosUploadPending,
}: useUpdateUserFormStructureProps) => {
  const { t } = useTranslation("user-management");

  // Step 1 *************************************************************************************

  //photo
  const photoField: Field<ImageFieldProps> = {
    id: "photo",
    label: t("userManagement.forms.photo"),
    variant: FieldVariant.IMAGE,
    className: "bg-muted border-2 w-40 h-40 my-2 rounded-full",
    wrapperClassName: "flex flex-col gap-2 items-center",
    required: true,
    description: t("userManagement.forms.photoDescription"),
    error: t(userStore.updateDtoErrors?.photo?.[0]),
    props: {
      image: userStore.picture,
      progress: userStore.progress,
      placeholder: "/unknown-user.jpg",
      disabled: !!isProfilePictureUploadPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set("picture", value);
        userStore.setNested("updateDtoErrors.pictureId", []);
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
    error: t(userStore.updateDtoErrors?.firstName?.[0]),
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
    label: t("userManagement.forms.lastName"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Doe",
    description: t("userManagement.forms.lastNameDescription"),
    error: t(userStore.updateDtoErrors?.lastName?.[0]),
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
    label: t("userManagement.forms.email"),
    variant: FieldVariant.EMAIL,
    required: true,
    placeholder: "john@doe.com",
    description: t("userManagement.forms.emailDescription"),
    error: t(userStore.updateDtoErrors?.email?.[0]),
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
    label: t("userManagement.forms.dateOfBirth"),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "YYYY-MM-DD",
    description: t("userManagement.forms.dateOfBirthDescription"),
    error: t(userStore.updateDtoErrors?.dateOfBirth?.[0]),
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
    label: t("userManagement.forms.username"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t("userManagement.forms.usernamePlaceholder"),
    description: t("userManagement.forms.usernameDescription"),
    error: t(userStore.updateDtoErrors?.username?.[0]),
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
    label: `${t("userManagement.forms.requirePasswordCheckTitle")}`,
    variant: FieldVariant.CHECK,
    required: true,
    description: `${t("userManagement.forms.requirePasswordCheckDescription")}`,
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
    label: t("userManagement.forms.password"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.passwordPlaceholder"),
    description: t("userManagement.forms.passwordDescription"),
    error: t(userStore.updateDtoErrors?.password?.[0]),
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
    label: t("userManagement.forms.confirmPassword"),
    variant: FieldVariant.PASSWORD,
    required: true,
    placeholder: t("userManagement.forms.confirmPasswordPlaceholder"),
    description: t("userManagement.forms.confirmPasswordDescription"),
    error: t(userStore.updateDtoErrors?.confirmPassword?.[0]),
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
    label: t("userManagement.forms.role"),
    variant: FieldVariant.SELECT,
    required: true,
    description: t("userManagement.forms.roleDescription"),
    placeholder: t("userManagement.forms.rolePlaceholder"),
    error: t(userStore.updateDtoErrors.roleId?.[0]),
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
        title: `${t("userManagement.forms.step1FieldTitle")}`,
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
        title: `${t("userManagement.forms.step1Title")}`,
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

  // Step 2 *************************************************************************************

  const phoneField: Field<NumberFieldProps> = {
    id: "phone",
    label: `${t("userManagement.forms.phone")}`,
    variant: FieldVariant.NUMBER,
    required: false,
    placeholder: `${t("userManagement.forms.phonePlaceholder")}`,
    description: `${t("userManagement.forms.phoneDescription")}`,
    error: t(userStore.updateDtoErrors?.phone?.[0]),
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
    label: `${t("userManagement.forms.CIN")}`,
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: `${t("userManagement.forms.CINPlaceholder")}`,
    description: `${t("userManagement.forms.CINDescription")}`,
    error: t(userStore.updateDtoErrors?.cin?.[0]),
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
    label: `${t("userManagement.forms.bio")}`,
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: `${t("userManagement.forms.bioPlaceholder")}`,
    description: `${t("userManagement.forms.bioDescription")}`,
    error: t(userStore.updateDtoErrors?.bio?.[0]),
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
    label: `${t("userManagement.forms.gender")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${t("userManagement.forms.genderPlaceholder")}`,
    description: `${t("userManagement.forms.genderDescription")}`,
    error: t(userStore.updateDtoErrors?.gender?.[0]),
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
    label: `${t("userManagement.forms.isPrivate")}`,
    variant: FieldVariant.SWITCH,
    required: true,
    placeholder: `${t("userManagement.forms.isPrivatePlaceholder")}`,
    description: `${t("userManagement.forms.isPrivateDescription")}`,
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
    label: `${t("userManagement.forms.region")}`,
    variant: FieldVariant.SELECT,
    required: false,
    placeholder: `${t("userManagement.forms.regionPlaceholder")}`,
    description: `${t("userManagement.forms.regionDescription")}`,
    error: t(userStore.updateDtoErrors?.regionId?.[0]),
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
    title: `${t("userManagement.forms.step2Title")}`,
    description: `${t("userManagement.forms.step2Description")}`,
    orientation: "horizontal",
    fieldsets: [
      {
        title: `${t("userManagement.forms.step2FieldTitle")}`,
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
  // Step 3 *************************************************************************************

  const officialDocumentField: Field<ImageFieldProps> = {
    id: "official-document",
    label: t("userManagement.forms.officialDocument"),
    variant: FieldVariant.IMAGE,
    className: "bg-muted container w-[700px] h-[400px] my-2 rounded-lg",
    wrapperClassName: "flex flex-col gap-2",
    required: true,
    description: t("userManagement.forms.officialDocumentDescription"),
    error: t(userStore.createDtoErrors?.officialDocument?.[0]),
    props: {
      image: userStore.officialDocument,
      progress: userStore.progress,
      disabled: isOfficialDocumentUploadPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set("officialDocument", value);
        userStore.setNested("updateDtoErrors.officialDocumentId", []);
      },
      onUpload: (file, onProgress) => {
        userStore.set("progress", 0);
        uploadOfficialDocument({
          files: [file],
          onProgress: (progress: number) => {
            userStore.set("progress", progress);
            onProgress(progress);
          },
        });
      },
    },
  };

  const driverLicenseDocumentField: Field<ImageFieldProps> = {
    id: "driver-license-document",
    label: `${t("userManagement.forms.driverLicenseDocument")}`,
    variant: FieldVariant.IMAGE,
    className: "bg-muted container w-[700px] h-[400px] my-2 rounded-lg",
    wrapperClassName: "flex flex-col gap-2",
    required: true,
    description: t("userManagement.forms.driverLicenseDocumentDescription"),
    error: t(userStore.createDtoErrors?.driverLicenseDocument?.[0]),
    props: {
      image: userStore.driverLicenseDocument,
      progress: userStore.progress,
      disabled: isDriverLicenseDocumentPending,
      fallback: identifyUserAvatar(userStore.response),
      onFileChange: (value) => {
        userStore.set("driverLicenseDocument", value);
        userStore.setNested("updateDtoErrors.driverLicenseDocumentId", []);
      },
      onUpload: (file, onProgress) => {
        userStore.set("progress", 0);
        uploadDriverLicenseDocument({
          files: [file],
          onProgress: (progress: number) => {
            userStore.set("progress", progress);
            onProgress(progress);
          },
        });
      },
    },
  };

  const step3FormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("userManagement.forms.step3Title"),
        rows: [
          { fields: [officialDocumentField] },
          { fields: [driverLicenseDocumentField] },
        ],
      },
    ],
  };

  // Step 4 *************************************************************************************

  const uploadsField: Field<ImageGalleryFieldProps> = {
    id: "uploads",
    label: `${t("userManagement.forms.uploadsLabel")}`,
    description: `${t("userManagement.forms.uploadsDescription")}`,
    variant: FieldVariant.IMAGE_GALLERY,
    props: {
      images: userStore.images,
      disabled: isPhotosUploadPending,
      onFilesChange: (e: ImageFile[]) => {
        userStore.updateImages("update", e);
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
        title: `${t("userManagement.forms.step3Title")}`,
        rows: [{ fields: [uploadsField] }],
      },
    ],
  };

  return {
    userUpdateFormStructure,
    profileUpdateFormStructure,
    step3FormStructure,
    uploadsFormStructure,
  };
};
