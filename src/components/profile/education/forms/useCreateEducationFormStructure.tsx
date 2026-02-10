import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
  TextareaFieldProps,
} from "@/components/shared/form-builder/types";
import { EducationStore } from "../../../../hooks/stores/useEducationStore";
import { useTranslation } from "react-i18next";

interface useCreateEducationFormStructureProps {
  educationStore: EducationStore;
}

export const useCreateEducationFormStructure = ({
  educationStore,
}: useCreateEducationFormStructureProps) => {
  const { t } = useTranslation("user-management");

  // Title field
  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("userManagement.inspect.books.education.forms.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "userManagement.inspect.books.education.forms.titlePlaceholder",
    ),
    description: t(
      "userManagement.inspect.books.education.forms.titleDescription",
    ),
    error: t(educationStore.createDtoErrors?.title?.[0]),
    props: {
      value: educationStore.createDto.title || undefined,
      onChange: (value) => {
        educationStore.setNested("createDto.title", value);
        educationStore.setNested("createDtoErrors.title", []);
      },
    },
  };

  // Institution field
  const institutionField: Field<TextFieldProps> = {
    id: "institution",
    label: t("userManagement.inspect.books.education.forms.institution"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "userManagement.inspect.books.education.forms.institutionPlaceholder",
    ),
    description: t(
      "userManagement.inspect.books.education.forms.institutionDescription",
    ),
    error: t(educationStore.createDtoErrors?.institution?.[0]),
    props: {
      value: educationStore.createDto.institution || undefined,
      onChange: (value) => {
        educationStore.setNested("createDto.institution", value);
        educationStore.setNested("createDtoErrors.institution", []);
      },
    },
  };

  // Start date field
  const startDateField: Field<DateFieldProps> = {
    id: "startDate",
    label: t("userManagement.inspect.books.education.forms.startDate"),
    variant: FieldVariant.DATE,
    required: true,
    placeholder: "YYYY-MM-DD",
    description: t(
      "userManagement.inspect.books.education.forms.startDateDescription",
    ),
    error: t(educationStore.createDtoErrors?.startDate?.[0]),
    props: {
      value: educationStore.createDto.startDate || undefined,
      onDateChange: (value: Date | null) => {
        educationStore.setNested("createDto.startDate", value);
        educationStore.setNested("createDtoErrors.startDate", []);
      },
      nullable: false,
    },
  };

  // End date field
  const endDateField: Field<DateFieldProps> = {
    id: "endDate",
    label: t("userManagement.inspect.books.education.forms.endDate"),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "YYYY-MM-DD",
    description: t(
      "userManagement.inspect.books.education.forms.endDateDescription",
    ),
    error: t(educationStore.createDtoErrors?.endDate?.[0]),
    props: {
      value: educationStore.createDto.endDate || undefined,
      onDateChange: (value: Date | null) => {
        educationStore.setNested("createDto.endDate", value);
        educationStore.setNested("createDtoErrors.endDate", []);
      },
      nullable: true,
    },
  };

  // Description field
  const descriptionField: Field<TextareaFieldProps> = {
    id: "description",
    label: t("userManagement.inspect.books.education.forms.description"),
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: t(
      "userManagement.inspect.books.education.forms.descriptionPlaceholder",
    ),
    description: t(
      "userManagement.inspect.books.education.forms.descriptionDescription",
    ),
    error: t(educationStore.createDtoErrors?.description?.[0]),
    props: {
      value: educationStore.createDto.description || undefined,
      onChange: (value) => {
        educationStore.setNested("createDto.description", value);
        educationStore.setNested("createDtoErrors.description", []);
      },
      rows: 5,
    },
  };

  const educationCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "horizontal",
    fieldsets: [
      {
        title: t("userManagement.inspect.books.education.forms.title"),
        description: "",
        rows: [
          { fields: [titleField, institutionField] },
          { fields: [startDateField, endDateField] },
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return {
    educationCreateFormStructure,
  };
};
