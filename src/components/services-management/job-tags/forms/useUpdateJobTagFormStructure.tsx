import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobTagStore } from "@/hooks/stores/useJobTagStore";
import { useTranslation } from "react-i18next";

interface JobTagUpdateFormStructureProps {
  jobTagStore: JobTagStore;
}
export const useUpdateJobTagFormStructure = ({
  jobTagStore,
}: JobTagUpdateFormStructureProps) => {
  const { t } = useTranslation("job");
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: `${t("jobTags.forms.label")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("jobTags.forms.labelPlaceholder")}`,
    description: `${t("jobTags.forms.labelDescription")}`,
    error: jobTagStore.updateDtoErrors?.label?.[0],
    props: {
      value: jobTagStore.updateDto.label || undefined,
      onChange: (value) => {
        jobTagStore.setNested("updateDto.label", value);
        jobTagStore.setNested("updateDtoErrors.label", []);
      },
    },
  };

  const jobTagUpdateFormStructure: FormStructure = {
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
    jobTagUpdateFormStructure,
  };
};
