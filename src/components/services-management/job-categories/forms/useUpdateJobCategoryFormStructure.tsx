import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobCategoryStore } from "@/hooks/stores/useJobCategoryStore";
import { useTranslation } from "react-i18next";

interface JobCategoryUpdateFormStructureProps {
  jobCategoryStore: JobCategoryStore;
}
export const useUpdateJobCategoryFormStructure = ({
  jobCategoryStore,
}: JobCategoryUpdateFormStructureProps) => {
  const { t } = useTranslation("job");
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: `${t("jobCategory.forms.label")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("jobCategory.forms.labelPlaceholder")}`,
    description: `${t("jobCategory.forms.labelDescription")}`,
    error: jobCategoryStore.updateDtoErrors?.label?.[0],
    props: {
      value: jobCategoryStore.updateDto.label || undefined,
      onChange: (value) => {
        jobCategoryStore.setNested("updateDto.label", value);
        jobCategoryStore.setNested("updateDtoErrors.label", []);
      },
    },
  };

  const jobCategoryUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "General Information",
        description: "General information about the region.",
        rows: [
          {
            fields: [labelField],
          },
        ],
      },
    ],
  };

  return {
    jobCategoryUpdateFormStructure,
  };
};
