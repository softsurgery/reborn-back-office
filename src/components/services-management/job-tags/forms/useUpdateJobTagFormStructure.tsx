import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobTagStore } from "@/hooks/stores/useJobTagStore";

interface JobTagUpdateFormStructureProps {
  jobTagStore: JobTagStore;
}
export const useUpdateJobTagFormStructure = ({
  jobTagStore,
}: JobTagUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Job Tag Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job tag label",
    description: "The label for the job tag.",
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
