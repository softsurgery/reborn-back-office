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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("job");
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.updateDto.currencyId
    );
  }, [currencies, jobStore.updateDto.currencyId]);

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: `${t("job.forms.titleLabel")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("job.forms.titlePlaceholder")}`,
    description: `${t("job.forms.titleDescription")}`,
    error: t(jobStore.updateDtoErrors?.title?.[0]),
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
    label: `${t("job.forms.descriptionLabel")}`,
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder: `${t("job.forms.descriptionPlaceholder")}`,
    description: `${t("job.forms.descriptionDescription")}`,
    error: t(jobStore.updateDtoErrors?.description?.[0]),
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
    label: `${t("job.forms.priceLabel")}`,
    variant: FieldVariant.NUMBER,
    required: true,
    placeholder: `${t("job.forms.pricePlaceholder")}`,
    description: `${t("job.forms.priceDescription")}`,
    error: t(jobStore.updateDtoErrors?.price?.[0]),
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
    label: `${t("job.forms.currencyLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.currencyDescription")}`,
    placeholder: `${t("job.forms.currencyPlaceholder")}`,
    error: t(jobStore.updateDtoErrors?.currencyId?.[0]),
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
    label: `${t("job.forms.uploadsLabel")}`,
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

  const generalInformationUpdateFormStructure: FormStructure = {
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

  const detailedInformationUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Detailed Information",
        description: "Update the detailed information about the job.",
        rows: [
          {
            fields: [uploadsField],
          },
        ],
      },
    ],
  };

  return {
    generalInformationUpdateFormStructure,
    detailedInformationUpdateFormStructure,
  };
};
