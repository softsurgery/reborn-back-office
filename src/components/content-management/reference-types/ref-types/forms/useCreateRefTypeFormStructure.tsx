import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { ReferenceTypesStore } from "@/hooks/stores/useReferenceTypesStore";

interface RefTypeCreateFormStructureProps {
  referenceTypesStore?: ReferenceTypesStore;
}
export const useCreateRefTypeFormStructure = ({
  referenceTypesStore,
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
