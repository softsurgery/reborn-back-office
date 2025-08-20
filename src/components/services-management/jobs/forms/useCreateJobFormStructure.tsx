import {
  Field,
  FieldVariant,
  FormStructure,
  ImageFile,
  ImageGalleryFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobStore } from "@/hooks/stores/useJobStore";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import { ResponseCurrencyDto } from "@/types";
import React from "react";

interface JobCreateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseCurrencyDto[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}
export const useCreateJobFormStructure = ({
  jobStore,
  currencies,
  uploadPicture,
}: JobCreateFormStructureProps) => {
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.createDto.currencyId
    );
  }, [currencies, jobStore.createDto.currencyId]);

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
      value: jobStore.createDto?.price,
      onChange: (value) => {
        if (
          value == Number(value.toFixed(selectedCurrency?.digitsAfterComma))
        ) {
          jobStore.setNested("createDto.price", Number(value));
          jobStore.setNested("createDtoErrors.price", []);
        }
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
    error: jobStore.createDtoErrors?.currencyId?.[0],
    props: {
      options: currencies.map((currency) => ({
        label: `${currency.label} (${currency.symbol})`,
        value: currency.id.toString(),
      })),
      value: jobStore.createDto?.currencyId?.toString(),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.currencyId", value);
        jobStore.setNested("createDtoErrors.currencyId", []);
      },
    },
  };

  const uploadsField: Field<ImageGalleryFieldProps> = {
    id: "uploads",
    label: "Uploads",
    variant: FieldVariant.IMAGE_GALLERY,
    props: {
      images: jobStore.images,
      onFilesChange: (e: ImageFile[]) => {
        jobStore.updateImages("create", e);
      },
      onUpload: (file, onProgress) => {
        uploadPicture({
          files: [file],
          onProgress: (progress: number) => {
            jobStore.setImageProgress(file, progress);
            onProgress(progress);
          },
        });
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
            fields: [priceField, currencyField],
          },
          {
            fields: [uploadsField],
          },
        ],
      },
    ],
  };

  return {
    jobCreateFormStructure,
  };
};
