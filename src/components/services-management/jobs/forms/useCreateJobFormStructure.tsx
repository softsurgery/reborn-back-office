import React from "react";
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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("job");
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.createDto.currencyId
    );
  }, [currencies, jobStore.createDto.currencyId]);

  const titleField: Field<TextFieldProps> = {
    id: "title",
    label: `${t("job.forms.titleLabel")}`,
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: `${t("job.forms.titlePlaceholder")}`,
    description: `${t("job.forms.titleDescription")}`,
    error: t(jobStore.createDtoErrors?.title?.[0]),
    props: {
      value: jobStore.createDto.title,
      onChange: (value) => {
        jobStore.setNested("createDto.title", value);
        jobStore.setNested("createDtoErrors.title", []);
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
    error: t(jobStore.createDtoErrors?.description?.[0]),
    props: {
      value: jobStore.createDto.description,
      rows: 8,
      onChange: (value) => {
        jobStore.setNested("createDto.description", value);
        jobStore.setNested("createDtoErrors.description", []);
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
    error: t(jobStore.createDtoErrors?.price?.[0]),
    props: {
      value: jobStore.createDto?.price || undefined,
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
    label: `${t("job.forms.currencyLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.currencyDescription")}`,
    placeholder: `${t("job.forms.currencyPlaceholder")}`,
    error: t(jobStore.createDtoErrors?.currencyId?.[0]),
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
    label: `${t("job.forms.uploadsLabel")}`,
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

  const generalInformationCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: `${t("job.forms.generalInformationTitle")}`,
        description: `${t("job.forms.generalInformationDescription")}`,
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

  const detailedInformationCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: `${t("job.forms.detailInformationTitle")}`,
        description: `${t("job.forms.detailInformationDescription")}`,
        rows: [
          {
            fields: [uploadsField],
          },
        ],
      },
    ],
  };

  return {
    generalInformationCreateFormStructure,
    detailedInformationCreateFormStructure,
  };
};
