import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";

interface RefTypeCreateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
  refTypesOptions?: SelectOption[];
}
export const useCreateRefTypeFormStructure = ({
  referenceTypesStore,
  refTypesOptions,
}: RefTypeCreateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Currency",
    description: "Reference Type's label.",
    error: referenceTypesStore?.refTypeCreateDtoErrors?.label?.[0],
    props: {
      value: referenceTypesStore?.refTypeCreateDto.label || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refTypeCreateDto.label", value);
        referenceTypesStore?.setNested("refTypeCreateDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextFieldProps> = {
    id: "description",
    label: "Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder:
      "Ex. Currency RefType is a type that allows you to manage currencies.",
    description: "Reference Type's description.",
    error: referenceTypesStore?.refTypeCreateDtoErrors?.description?.[0],
    props: {
      value: referenceTypesStore?.refTypeCreateDto.description || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refTypeCreateDto.description", value);
        referenceTypesStore?.setNested(
          "refTypeCreateDtoErrors.description",
          []
        );
      },
    },
  };

  const refTypeField: Field<SelectFieldProps> = {
    id: "refTypeId",
    label: "Reference Type",
    variant: FieldVariant.SELECT,
    placeholder: "Select a reference type",
    description: "Reference Type's reference parameter.",
    error: referenceTypesStore?.refTypeCreateDtoErrors?.refTypeId?.[0],
    props: {
      options: refTypesOptions,
      value:
        referenceTypesStore?.refTypeCreateDto.parentId?.toString() || undefined,
      onValueChange: (value) => {
        referenceTypesStore?.setNested(
          "refTypeCreateDto.parentId",
          Number(value)
        );
        referenceTypesStore?.setNested("refTypeCreateDtoErrors.parentId", []);
      },
    },
  };

  const refTypeCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Create Reference Type",
        description: "Create a new reference type.",
        rows: [
          {
            fields: [labelField],
          },
          {
            fields: [refTypeField],
          },
          {
            fields: [descriptionField],
          },
        ],
      },
    ],
  };

  return {
    refTypeCreateFormStructure,
  };
};
