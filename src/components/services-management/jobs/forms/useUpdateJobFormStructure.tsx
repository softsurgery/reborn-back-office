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

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseCurrencyDto[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}
export const useUpdateJobFormStructure = ({
  jobStore,
  currencies,
  uploadPicture,
}: JobUpdateFormStructureProps) => {
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.updateDto.currencyId
    );
  }, [currencies, jobStore.updateDto.currencyId]);

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
        if (
          value == Number(value.toFixed(selectedCurrency?.digitsAfterComma))
        ) {
          jobStore.setNested("updateDto.price", Number(value));
          jobStore.setNested("updateDtoErrors.price", []);
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
    error: jobStore.updateDtoErrors?.currencyId?.[0],
    props: {
      options: currencies.map((currency) => ({
        label: `${currency.label} (${currency.symbol})`,
        value: currency.id.toString(),
      })),
      value: jobStore.updateDto?.currencyId?.toString(),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.currencyId", value);
        jobStore.setNested("updateDtoErrors.currencyId", []);
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
        jobStore.updateImages("update", e);
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
          {
            fields: [uploadsField],
          },
        ],
      },
    ],
  };

  return {
    jobUpdateFormStructure,
  };
};
