import React from "react";
import {
  Field,
  FieldVariant,
  FormStructure,
  ImageFile,
  ImageGalleryFieldProps,
  MultiSelectFieldProps,
  NumberFieldProps,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JobStore } from "@/hooks/stores/useJobStore";
import { useUploadMutation } from "@/hooks/useUploadMutation";
import {
  JobDifficulty,
  JobPricingType,
  JobStatus,
  JobStyle,
  ResponseRefParamDto,
} from "@/types";
import { useTranslation } from "react-i18next";

interface JobCreateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseRefParamDto[];
  jobTags: SelectOption[];
  jobCategories: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}
export const useCreateJobFormStructure = ({
  jobStore,
  currencies,
  jobTags,
  jobCategories,
  uploadPicture,
}: JobCreateFormStructureProps) => {
  const { t } = useTranslation("job");
  const selectedCurrency = React.useMemo(() => {
    return currencies.find(
      (currency) => currency.id === jobStore.createDto.currencyId,
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

  const statusField: Field<SelectFieldProps> = {
    id: "status",
    label: `${t("job.forms.statusLabel", "Status")}`,
    variant: FieldVariant.SELECT,
    description: `${t("job.forms.statusDescription", "Choose the current status of the job.")}`,
    placeholder: `${t("job.forms.statusPlaceholder", "Select a status")}`,
    error: t(jobStore.createDtoErrors?.status?.[0]),
    props: {
      value: jobStore.createDto?.status,
      options: Object.values(JobStatus).map((status) => ({
        label: status,
        value: status,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.status", value as JobStatus);
        jobStore.setNested("createDtoErrors.status", []);
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
          value ==
          Number(value.toFixed(selectedCurrency?.extras?.digitsAfterComma))
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
        label: `${currency.label} (${currency.extras?.symbol})`,
        value: currency.id.toString(),
      })),
      value: jobStore.createDto?.currencyId?.toString(),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.currencyId", Number(value));
        jobStore.setNested("createDtoErrors.currencyId", []);
      },
    },
  };

  const pricingTypeField: Field<SelectFieldProps> = {
    id: "pricingType",
    label: `${t("job.forms.pricingTypeLabel", "Pricing Type")}`,
    variant: FieldVariant.SELECT,
    description: `${t("job.forms.pricingTypeDescription", "Choose how the job is priced.")}`,
    placeholder: `${t("job.forms.pricingTypePlaceholder", "Select a pricing type")}`,
    error: t(jobStore.createDtoErrors?.pricingType?.[0]),
    props: {
      value: jobStore.createDto?.pricingType,
      options: Object.values(JobPricingType).map((type) => ({
        label: type === JobPricingType.FIXED ? "Fixed Price" : "Hourly Rate",
        value: type,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.pricingType", value as JobPricingType);
        jobStore.setNested("createDtoErrors.pricingType", []);
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

  const jobTagsField: Field<MultiSelectFieldProps> = {
    id: "tags",
    label: `${t("job.forms.tagsLabel")}`,
    variant: FieldVariant.MULTI_SELECT,
    required: true,
    description: `${t("job.forms.tagsDescription")}`,
    placeholder: `${t("job.forms.tagsPlaceholder")}`,
    error: t(jobStore.createDtoErrors?.tags?.[0]),
    props: {
      options: jobTags,
      value: jobTags.filter((option: SelectOption) =>
        jobStore.createDto?.tagIds?.includes(Number(option.value)),
      ),
      onChange: (value) => {
        jobStore.setNested(
          "createDto.tagIds",
          value.map((v) => Number(v.value)),
        );
        jobStore.setNested("createDtoErrors.tagIds", []);
      },
    },
  };

  const jobCategoriesField: Field<SelectFieldProps> = {
    id: "categories",
    label: `${t("job.forms.categoriesLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.categoriesDescription")}`,
    placeholder: `${t("job.forms.categoriesPlaceholder")}`,
    error: t(jobStore.createDtoErrors?.categoryId?.[0]),
    props: {
      options: jobCategories,
      value: jobStore.createDto?.categoryId?.toString(),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.categoryId", Number(value));
        jobStore.setNested("createDtoErrors.categoryId", []);
      },
    },
  };

  const jobStylesField: Field<SelectFieldProps> = {
    id: "styles",
    label: `${t("job.forms.stylesLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.stylesDescription")}`,
    placeholder: `${t("job.forms.stylesPlaceholder")}`,
    error: t(jobStore.createDtoErrors?.style?.[0]),
    props: {
      value: jobStore.createDto?.style,
      options: Object.values(JobStyle).map((style) => ({
        label: style,
        value: style,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.style", value as JobStyle);
        jobStore.setNested("createDtoErrors.style", []);
      },
    },
  };

  const jobDifficultyField: Field<SelectFieldProps> = {
    id: "difficulty",
    label: `${t("job.forms.difficultyLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.difficultyDescription")}`,
    placeholder: `${t("job.forms.difficultyPlaceholder")}`,
    error: t(jobStore.createDtoErrors?.difficulty?.[0]),
    props: {
      value: jobStore.createDto?.difficulty,
      options: Object.values(JobDifficulty).map((difficulty) => ({
        label: difficulty,
        value: difficulty,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("createDto.difficulty", value as JobDifficulty);
        jobStore.setNested("createDtoErrors.difficulty", []);
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
            fields: [titleField, statusField],
          },
          {
            fields: [descriptionField],
          },
          {
            fields: [priceField, currencyField, pricingTypeField],
          },
          {
            fields: [jobCategoriesField, jobStylesField],
          },
          {
            fields: [jobTagsField, jobDifficultyField],
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
        title: `${t("job.forms.detailedInformationTitle", "Detailed Information")}`,
        description: `${t("job.forms.detailedInformationDescription", "Additional details about the job.")}`,
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
