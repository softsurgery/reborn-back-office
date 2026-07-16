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
import { JobDifficulty, JobPricingType, JobStatus, JobStyle, ResponseRefParamDto } from "@/types";
import React from "react";
import { useTranslation } from "react-i18next";

interface JobUpdateFormStructureProps {
  jobStore: JobStore;
  currencies: ResponseRefParamDto[];
  jobTags: SelectOption[];
  jobCategories: SelectOption[];
  uploadPicture: ReturnType<typeof useUploadMutation>["uploadFiles"];
}
export const useUpdateJobFormStructure = ({
  jobStore,
  currencies,
  jobTags,
  jobCategories,
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

  const statusField: Field<SelectFieldProps> = {
    id: "status",
    label: `${t("job.forms.statusLabel", "Status")}`,
    variant: FieldVariant.SELECT,
    description: `${t("job.forms.statusDescription", "Choose the current status of the job.")}`,
    placeholder: `${t("job.forms.statusPlaceholder", "Select a status")}`,
    error: t(jobStore.updateDtoErrors?.status?.[0]),
    props: {
      value: jobStore.updateDto?.status,
      options: Object.values(JobStatus).map((status) => ({
        label: status,
        value: status,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.status", value as JobStatus);
        jobStore.setNested("updateDtoErrors.status", []);
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
      value: jobStore.updateDto?.price || undefined,
      onChange: (value) => {
        if (
          value ==
          Number(value.toFixed(selectedCurrency?.extras?.digitsAfterComma))
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
        label: `${currency.label} (${currency.extras?.symbol})`,
        value: currency.id.toString(),
      })),
      value: jobStore.updateDto?.currencyId?.toString(),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.currencyId", value);
        jobStore.setNested("updateDtoErrors.currencyId", []);
      },
    },
  };

  const pricingTypeField: Field<SelectFieldProps> = {
    id: "pricingType",
    label: `${t("job.forms.pricingTypeLabel", "Pricing Type")}`,
    variant: FieldVariant.SELECT,
    description: `${t("job.forms.pricingTypeDescription", "Choose how the job is priced.")}`,
    placeholder: `${t("job.forms.pricingTypePlaceholder", "Select a pricing type")}`,
    error: t(jobStore.updateDtoErrors?.pricingType?.[0]),
    props: {
      value: jobStore.updateDto?.pricingType,
      options: Object.values(JobPricingType).map((type) => ({
        label: type === JobPricingType.FIXED ? "Fixed Price" : "Hourly Rate",
        value: type,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.pricingType", value as JobPricingType);
        jobStore.setNested("updateDtoErrors.pricingType", []);
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
    error: t(jobStore.updateDtoErrors?.tags?.[0]),
    props: {
      options: jobTags,
      value: jobTags.filter((option: SelectOption) =>
        jobStore.updateDto?.tagIds?.includes(Number(option.value))
      ),
      onChange: (value) => {
        jobStore.setNested(
          "updateDto.tagIds",
          value.map((v) => Number(v.value))
        );
        jobStore.setNested("updateDtoErrors.tagIds", []);
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
    error: t(jobStore.updateDtoErrors?.categoryId?.[0]),
    props: {
      options: jobCategories,
      value: jobStore.updateDto?.categoryId?.toString(),
      onValueChange: (value) => {
        jobStore.setNested("updateDto.categoryId", Number(value));
        jobStore.setNested("updateDtoErrors.categoryId", []);
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
  const jobStylesField: Field<SelectFieldProps> = {
    id: "styles",
    label: `${t("job.forms.stylesLabel")}`,
    variant: FieldVariant.SELECT,
    required: true,
    description: `${t("job.forms.stylesDescription")}`,
    placeholder: `${t("job.forms.stylesPlaceholder")}`,
    error: t(jobStore.updateDtoErrors?.style?.[0]),
    props: {
      value: jobStore.updateDto?.style,
      options: Object.values(JobStyle).map((style) => ({
        label: style,
        value: style,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.style", value as JobStyle);
        jobStore.setNested("updateDtoErrors.style", []);
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
    error: t(jobStore.updateDtoErrors?.difficulty?.[0]),
    props: {
      value: jobStore.updateDto?.difficulty,
      options: Object.values(JobDifficulty).map((difficulty) => ({
        label: difficulty,
        value: difficulty,
      })),
      onValueChange: (value: string) => {
        jobStore.setNested("updateDto.difficulty", value as JobDifficulty);
        jobStore.setNested("updateDtoErrors.difficulty", []);
      },
    },
  };

  const latitudeField: Field<NumberFieldProps> = {
    id: "latitude",
    label: `${t("job.forms.latitudeLabel", "Latitude")}`,
    variant: FieldVariant.NUMBER,
    placeholder: `${t("job.forms.latitudePlaceholder", "Enter latitude coordinate")}`,
    description: `${t("job.forms.latitudeDescription", "Geographical latitude coordinate.")}`,
    error: t(jobStore.updateDtoErrors?.latitude?.[0]),
    props: {
      value: jobStore.updateDto?.latitude ?? undefined,
      onChange: (value) => {
        jobStore.setNested("updateDto.latitude", value !== null && value !== undefined && !isNaN(Number(value)) ? Number(value) : undefined);
        jobStore.setNested("updateDtoErrors.latitude", []);
      },
    },
  };

  const longitudeField: Field<NumberFieldProps> = {
    id: "longitude",
    label: `${t("job.forms.longitudeLabel", "Longitude")}`,
    variant: FieldVariant.NUMBER,
    placeholder: `${t("job.forms.longitudePlaceholder", "Enter longitude coordinate")}`,
    description: `${t("job.forms.longitudeDescription", "Geographical longitude coordinate.")}`,
    error: t(jobStore.updateDtoErrors?.longitude?.[0]),
    props: {
      value: jobStore.updateDto?.longitude ?? undefined,
      onChange: (value) => {
        jobStore.setNested("updateDto.longitude", value !== null && value !== undefined && !isNaN(Number(value)) ? Number(value) : undefined);
        jobStore.setNested("updateDtoErrors.longitude", []);
      },
    },
  };

  const generalInformationUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: `${t("job.forms.generalInformationTitle", "General Information")}`,
        description: `${t("job.forms.generalInformationDescription", "Update the information about the job.")}`,
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

  const detailedInformationUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: `${t("job.forms.detailedInformationTitle", "Detailed Information")}`,
        description: `${t("job.forms.detailedInformationDescription", "Update the detailed information about the job.")}`,
        rows: [
          {
            fields: [latitudeField, longitudeField],
          },
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
