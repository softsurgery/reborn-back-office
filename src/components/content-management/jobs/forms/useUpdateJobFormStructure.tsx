import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobStore } from "@/hooks/stores/useJobStore";

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
}
export const useUpdateJobFormStructure = ({
  jobStore,
}: JobUpdateFormStructureProps) => {
  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: "Job Title",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job title",
    description: "The title for the job.",
    error: jobStore.updateDtoErrors?.title?.[0],
    props: {
      value: jobStore.updateDto.title || undefined,
      onChange: (value) => {
        jobStore.setNested("updateDto.title", value);
        jobStore.setNested("updateDtoErrors.title", []);
      },
    },
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: "description",
    label: "Job Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: "Enter job description",
    description: "The description for the job.",
    error: jobStore.updateDtoErrors?.description?.[0],
    props: {
      value: jobStore.updateDto.description || undefined,
      rows: 8,
      onChange: (value) => {
        jobStore.setNested("updateDto.description", value);
        jobStore.setNested("updateDtoErrors.description", []);
      },
    },
  };

  const priceField: Field<NumberFieldProps> = {
    id: "price",
    label: "Job Price",
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: "Enter job price",
    description: "The price for the job.",
    error: jobStore.updateDtoErrors?.price?.[0],
    props: {
      value: jobStore.updateDto.price || undefined,
      onChange: (value) => {
        jobStore.setNested("updateDto.price", value);
        jobStore.setNested("updateDtoErrors.price", []);
      },
    },
  };

  const jobUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "General Information",
        description: "Update the information about the job.",
        rows: [
          {
            fields: [titleField],
          },
          {
            fields: [descriptionField],
          },
          {
            fields: [priceField],
          },
        ],
      },
    ],
  };

  return {
    jobUpdateFormStructure,
  };
};
