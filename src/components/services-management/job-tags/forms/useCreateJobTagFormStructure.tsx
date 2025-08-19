import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobTagStore } from "@/hooks/stores/useJobTagStore";

interface JobTagCreateFormStructureProps {
  jobTagStore: JobTagStore;
}
export const useCreateJobTagFormStructure = ({
  jobTagStore,
}: JobTagCreateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "JobTag Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job tag label",
    description: "The label for the job tag.",
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
