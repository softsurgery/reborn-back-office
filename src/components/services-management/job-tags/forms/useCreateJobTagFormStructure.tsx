import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobTagStore } from "@/hooks/stores/useJobTagStore";
import { useTranslation } from "react-i18next";

interface JobTagCreateFormStructureProps {
  jobTagStore: JobTagStore;
}
export const useCreateJobTagFormStructure = ({
  jobTagStore,
}: JobTagCreateFormStructureProps) => {
  const { t } = useTranslation("job");
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: `${t("jobTags.forms.label")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("jobTags.forms.labelPlaceholder")}`,
    description: `${t("jobTags.forms.labelDescription")}`,
    error: jobTagStore.createDtoErrors?.label?.[0],
    props: {
      value: jobTagStore.createDto.label || undefined,
      onChange: (value) => {
        jobTagStore.setNested("createDto.label", value);
        jobTagStore.setNested("createDtoErrors.label", []);
      },
    },
  };

  const jobTagCreateFormStructure: FormStructure = {
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
    jobTagCreateFormStructure,
  };
};
