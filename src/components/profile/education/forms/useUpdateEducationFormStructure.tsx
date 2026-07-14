import {
  DateFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
  TextareaFieldProps,
} from "@/components/shared/form-builder/types";
import { useTranslation } from "react-i18next";
import { EducationStore } from "../../../../hooks/stores/useEducationStore";

interface useUpdateEducationFormStructureProps {
  educationStore: EducationStore;
}

export const useUpdateEducationFormStructure = ({
  educationStore,
}: useUpdateEducationFormStructureProps) => {
  const { t } = useTranslation("user-management");

  // Title field
  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: t("userManagement.inspect.career.education.forms.title"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "userManagement.inspect.career.education.forms.titlePlaceholder",
    ),
    description: t(
      "userManagement.inspect.career.education.forms.titleDescription",
    ),
    error: t(educationStore.updateDtoErrors?.title?.[0]),
    props: {
      value: educationStore.updateDto.title || undefined,
      onChange: (value) => {
        educationStore.setNested("updateDto.title", value);
        educationStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  // Institution field
  const institutionField: Field<TextFieldProps> = {
    id: "institution",
    label: t("userManagement.inspect.career.education.forms.institution"),
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: t(
      "userManagement.inspect.career.education.forms.institutionPlaceholder",
    ),
    description: t(
      "userManagement.inspect.career.education.forms.institutionDescription",
    ),
    error: t(educationStore.updateDtoErrors?.institution?.[0]),
    props: {
      value: educationStore.updateDto.institution || undefined,
      onChange: (value) => {
        educationStore.setNested("updateDto.institution", value);
        educationStore.setNested("updateDtoErrors.institution", []);
      },
    },
  };

  // Start date field
  const startDateField: Field<DateFieldProps> = {
    id: "startDate",
    label: t("userManagement.inspect.career.education.forms.startDate"),
    variant: FieldVariant.DATE,
    required: true,
    placeholder: "YYYY-MM-DD",
    description: t(
      "userManagement.inspect.career.education.forms.startDateDescription",
    ),
    error: t(educationStore.updateDtoErrors?.startDate?.[0]),
    props: {
      value: educationStore.updateDto.startDate || undefined,
      onDateChange: (value: Date | null) => {
        educationStore.setNested("updateDto.startDate", value);
        educationStore.setNested("updateDtoErrors.startDate", []);
      },
      nullable: false,
    },
  };

  // End date field
  const endDateField: Field<DateFieldProps> = {
    id: "endDate",
    label: t("userManagement.inspect.career.education.forms.endDate"),
    variant: FieldVariant.DATE,
    required: false,
    placeholder: "YYYY-MM-DD",
    description: t(
      "userManagement.inspect.career.education.forms.endDateDescription",
    ),
    error: t(educationStore.updateDtoErrors?.endDate?.[0]),
    props: {
      value: educationStore.updateDto.endDate || undefined,
      onDateChange: (value: Date | null) => {
        educationStore.setNested("updateDto.endDate", value);
        educationStore.setNested("updateDtoErrors.endDate", []);
      },
      nullable: true,
    },
  };

  // Description field
  const descriptionField: Field<TextareaFieldProps> = {
    id: "description",
    label: t("userManagement.inspect.career.education.forms.description"),
    variant: FieldVariant.TEXTAREA,
    required: false,
    placeholder: t(
      "userManagement.inspect.career.education.forms.descriptionPlaceholder",
    ),
    description: t(
      "userManagement.inspect.career.education.forms.descriptionDescription",
    ),
    error: t(educationStore.updateDtoErrors?.description?.[0]),
    props: {
      value: educationStore.updateDto.description || undefined,
      onChange: (value) => {
        educationStore.setNested("updateDto.description", value);
        educationStore.setNested("updateDtoErrors.description", []);
      },
      rows: 5,
    },
  };

  const educationUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    orientation: "vertical",
    fieldsets: [
      {
        title: t("userManagement.inspect.career.education.forms.updateTitle"),
        description: "",
        rows: [
          { fields: [titleField] },
          { fields: [institutionField] },
          { fields: [startDateField] },
          { fields: [endDateField] },
          { fields: [descriptionField] },
        ],
      },
    ],
  };

  return {
    educationUpdateFormStructure,
  };
};
