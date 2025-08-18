import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobStore } from "@/hooks/stores/useJobStore";

interface JobCreateFormStructureProps {
  jobStore: JobStore;
}
export const useCreateJobFormStructure = ({
  jobStore,
}: JobCreateFormStructureProps) => {
  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: "Job Title",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter job title",
    description: "The title for the job.",
    error: jobStore.createDtoErrors?.title?.[0],
    props: {
      value: jobStore.createDto.title || undefined,
      onChange: (value) => {
        jobStore.setNested("createDto.title", value);
        jobStore.setNested("createDtoErrors.title", []);
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
    error: jobStore.createDtoErrors?.description?.[0],
    props: {
      value: jobStore.createDto.description || undefined,
      rows: 8,
      onChange: (value) => {
        jobStore.setNested("createDto.description", value);
        jobStore.setNested("createDtoErrors.description", []);
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
    error: jobStore.createDtoErrors?.price?.[0],
    props: {
      value: jobStore.createDto.price || undefined,
      onChange: (value) => {
        jobStore.setNested("createDto.price", value);
        jobStore.setNested("createDtoErrors.price", []);
      },
    },
  };

  const jobCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "General Information",
        description: "General information about the job.",
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
    jobCreateFormStructure,
  };
};
