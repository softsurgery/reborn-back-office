import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { RegionStore } from "@/hooks/stores/useRegionStore";

interface RegionCreateFormStructureProps {
  regionStore: RegionStore;
}
export const useCreateRegionFormStructure = ({
  regionStore,
}: RegionCreateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Region Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter region label",
    description: "The label for the region.",
    error: regionStore.createDtoErrors?.label?.[0],
    props: {
      value: regionStore.createDto.label || undefined,
      onChange: (value) => {
        regionStore.setNested("createDto.label", value);
        regionStore.setNested("createDtoErrors.label", []);
      },
    },
  };

  const regionCreateFormStructure: FormStructure = {
    title: "",
    description: "",
    fieldsets: [
      {
        title: "General Information",
        description: "General information about the region.",
        rows: [
          {
            fields: [labelField],
          },
        ],
      },
    ],
  };

  return {
    regionCreateFormStructure,
  };
};
