import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";

interface RefTypeUpdateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
}
export const useUpdateRefTypeFormStructure = ({
  referenceTypesStore,
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

  const descriptionField: Field<TextFieldProps> = {
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
          []
        );
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
