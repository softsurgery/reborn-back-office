import {
  Field,
  FieldVariant,
  FormStructure,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobStore } from "@/hooks/stores/useJobStore";

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
  currencies: SelectOption[];
}
export const useUpdateJobFormStructure = ({
  jobStore,
  currencies,
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
      value: jobStore.updateDto.title,
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
      value: jobStore.updateDto.description,
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
        jobStore.setNested("updateDto.price", Number(value));
        jobStore.setNested("updateDtoErrors.price", []);
      },
    },
  };

  //currency
  const currencyField: Field<SelectFieldProps> = {
    id: "currency",
    label: "Currency",
    variant: FieldVariant.SELECT,
    required: true,
    description: "Choose the currency for the job.",
    placeholder: "Select currency",
    error: jobStore.updateDtoErrors?.currencyId?.[0],
    props: {
      options: currencies,
      value: jobStore.updateDto?.currencyId?.toString(),
      onValueChange: (value: string) => {
        console.log(value);
        jobStore.setNested("updateDto.currencyId", Number(value));
        jobStore.setNested("updateDtoErrors.currencyId", []);
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
            fields: [priceField, currencyField],
          },
        ],
      },
    ],
  };

  return {
    jobUpdateFormStructure,
  };
};
