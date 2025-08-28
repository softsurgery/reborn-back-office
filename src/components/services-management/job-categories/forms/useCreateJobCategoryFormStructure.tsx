import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobCategoryStore } from "@/hooks/stores/useJobCategoryStore";
import { useTranslation } from "react-i18next";

interface JobCategoryCreateFormStructureProps {
  jobCategoryStore: JobCategoryStore;
}
export const useCreateJobCategoryFormStructure = ({
  jobCategoryStore,
}: JobCategoryCreateFormStructureProps) => {
  const { t } = useTranslation("job");
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: `${t("jobCategory.forms.label")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("jobCategory.forms.labelPlaceholder")}`,
    description: `${t("jobCategory.forms.labelDescription")}`,
    error: jobCategoryStore.createDtoErrors?.label?.[0],
    props: {
      value: jobCategoryStore.createDto.label || undefined,
      onChange: (value) => {
        jobCategoryStore.setNested("createDto.label", value);
        jobCategoryStore.setNested("createDtoErrors.label", []);
      },
    },
  };

  const jobCategoryCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "General Information",
        description: "General information about the job tag.",
        rows: [
          {
            fields: [labelField],
          },
        ],
      },
    ],
  };

  return {
    jobCategoryCreateFormStructure,
  };
};
