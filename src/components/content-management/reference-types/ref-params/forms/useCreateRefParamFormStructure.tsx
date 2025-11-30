/* eslint-disable react-hooks/rules-of-hooks */
import {
  CustomFieldProps,
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { JSONValue } from "@/components/shared/JsonEditor";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";
import React from "react";
import { RefParamExtras } from "../../../../shared/JSONExtras";

interface RefParamCreateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
  refTypesOptions?: SelectOption[];
}
export const useCreateRefParamFormStructure = ({
  referenceTypesStore,
  refTypesOptions,
}: RefParamCreateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Currency",
    description: "Reference Type's label.",
    error: referenceTypesStore?.refParamCreateDtoErrors?.label?.[0],
    props: {
      value: referenceTypesStore?.refParamCreateDto.label || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refParamCreateDto.label", value);
        referenceTypesStore?.setNested("refParamCreateDtoErrors.label", []);
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
    error: referenceTypesStore?.refParamCreateDtoErrors?.description?.[0],
    props: {
      value: referenceTypesStore?.refParamCreateDto.description || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refParamCreateDto.description", value);
        referenceTypesStore?.setNested(
          "refParamCreateDtoErrors.description",
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
    error: referenceTypesStore?.refParamCreateDtoErrors?.refTypeId?.[0],
    props: {
      options: refTypesOptions,
      value:
        referenceTypesStore?.refParamCreateDto.refTypeId?.toString() ||
        undefined,
      onValueChange: (value) => {
        referenceTypesStore?.setNested(
          "refParamCreateDto.refTypeId",
          Number(value)
        );
        referenceTypesStore?.setNested("refParamCreateDtoErrors.refTypeId", []);
      },
    },
  };

  const extrasField: Field<CustomFieldProps> = {
    id: "extras",
    label: "Extras",
    variant: FieldVariant.CUSTOM,
    description: "Reference Type's extras.",
    error: referenceTypesStore?.refParamCreateDtoErrors?.extras?.[0],
    props: {
      children: (
        <RefParamExtras
          value={referenceTypesStore?.refParamCreateDto.extras as JSONValue}
          onChange={(value) => {
            referenceTypesStore?.setNested("refParamCreateDto.extras", value);
            referenceTypesStore?.setNested(
              "refParamCreateDtoErrors.extras",
              []
            );
          }}
        />
      ),
    },
  };

  const refParamCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Create Reference Type",
        description: "Create a new reference type.",
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
    refParamCreateFormStructure,
  };
};
