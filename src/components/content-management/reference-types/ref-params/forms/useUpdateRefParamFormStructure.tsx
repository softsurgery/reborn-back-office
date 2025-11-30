import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import { RefParamExtras } from "../../../../shared/JSONExtras";
import { JSONValue } from "@/components/shared/JsonEditor";

interface RefParamUpdateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
  refTypesOptions?: SelectOption[];
}
export const useUpdateRefParamFormStructure = ({
  referenceTypesStore,
  refTypesOptions,
}: RefParamUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Currency",
    description: "Reference Type's label.",
    error: referenceTypesStore?.refParamUpdateDtoErrors?.label?.[0],
    props: {
      value: referenceTypesStore?.refParamUpdateDto.label || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refParamUpdateDto.label", value);
        referenceTypesStore?.setNested("refParamUpdateDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextFieldProps> = {
    id: "description",
    label: "Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder:
      "Ex. Currency RefParam is a type that allows you to manage currencies.",
    description: "Reference Type's description.",
    error: referenceTypesStore?.refParamUpdateDtoErrors?.description?.[0],
    props: {
      value: referenceTypesStore?.refParamUpdateDto.description || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refParamUpdateDto.description", value);
        referenceTypesStore?.setNested(
          "refParamUpdateDtoErrors.description",
          []
        );
      },
    },
  };

  const refTypeField: Field<SelectFieldProps> = {
    id: "refTypeId",
    label: "Reference Type",
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: "Select a reference type",
    description: "Reference Type's extras.",
    error: referenceTypesStore?.refParamUpdateDtoErrors?.refTypeId?.[0],
    props: {
      options: refTypesOptions,
      value:
        referenceTypesStore?.refParamUpdateDto.refTypeId?.toString() ||
        undefined,
      onValueChange: (value) => {
        referenceTypesStore?.setNested(
          "refParamUpdateDto.refTypeId",
          Number(value)
        );
        referenceTypesStore?.setNested("refParamUpdateDtoErrors.refTypeId", []);
      },
    },
  };

  const extrasField: Field<CustomFieldProps> = {
    id: "extras",
    label: "Extras",
    variant: FieldVariant.CUSTOM,
    description: "Reference Type's extras.",
    error: referenceTypesStore?.refParamUpdateDtoErrors?.extras?.[0],
    props: {
      children: (
        <RefParamExtras
          value={referenceTypesStore?.refParamUpdateDto.extras as JSONValue}
          onChange={(value) => {
            referenceTypesStore?.setNested("refParamUpdateDto.extras", value);
            referenceTypesStore?.setNested(
              "refParamUpdateDtoErrors.extras",
              []
            );
          }}
        />
      ),
    },
  };

  const refParamUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Update Reference Type",
        description: "Update a new reference type.",
        rows: [
          {
            fields: [labelField, refTypeField],
          },
          {
            fields: [descriptionField],
          },
          {
            fields: [extrasField],
          },
        ],
      },
    ],
  };

  return {
    refParamUpdateFormStructure,
  };
};
