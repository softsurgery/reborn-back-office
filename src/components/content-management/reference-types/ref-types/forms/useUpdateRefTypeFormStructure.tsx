import {
  Field,
  FieldVariant,
  FormStructure,
  SelectFieldProps,
  SelectOption,
  TextareaFieldProps,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";

interface RefTypeUpdateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
  refTypesOptions?: SelectOption[];
}
export const useUpdateRefTypeFormStructure = ({
  referenceTypesStore,
  refTypesOptions,
}: RefTypeUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Ex. Currency",
    description: "Reference Type's label.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.label?.[0],
    props: {
      value: referenceTypesStore?.refTypeUpdateDto.label || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refTypeUpdateDto.label", value);
        referenceTypesStore?.setNested("refTypeUpdateDtoErrors.label", []);
      },
    },
  };

  const descriptionField: Field<TextareaFieldProps> = {
    id: "description",
    label: "Description",
    variant: FieldVariant.TEXTAREA,
    required: true,
    placeholder:
      "Ex. Currency RefType is a type that allows you to manage currencies.",
    description: "Reference Type's description.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.description?.[0],
    props: {
      value: referenceTypesStore?.refTypeUpdateDto.description || undefined,
      onChange: (value) => {
        referenceTypesStore?.setNested("refTypeUpdateDto.description", value);
        referenceTypesStore?.setNested(
          "refTypeUpdateDtoErrors.description",
          [],
        );
      },
      rows: 7,
    },
  };

  const refTypeField: Field<SelectFieldProps> = {
    id: "refTypeId",
    label: "Reference Type",
    variant: FieldVariant.SELECT,
    required: true,
    placeholder: "Select a reference type",
    description: "Reference Type's reference parameter.",
    error: referenceTypesStore?.refTypeUpdateDtoErrors?.refTypeId?.[0],
    props: {
      options: refTypesOptions,
      value: referenceTypesStore?.refTypeUpdateDto.parentId?.toString(),
      onValueChange: (value) => {
        referenceTypesStore?.setNested("refTypeUpdateDto.parentId", value);
        referenceTypesStore?.setNested("refTypeUpdateDtoErrors.parentId", []);
      },
    },
  };

  const refTypeUpdateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "Update Reference Type",
        description: "Update a new reference type.",
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
    refTypeUpdateFormStructure,
  };
};
