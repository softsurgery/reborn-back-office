import {
  Field,
  FieldVariant,
  FormStructure,
  TextFieldProps,
} from "@/components/shared/form-builder/types";
import { RegionStore } from "@/hooks/stores/useRegionStore";

interface RegionUpdateFormStructureProps {
  regionStore: RegionStore;
}
export const useUpdateRegionFormStructure = ({
  regionStore,
}: RegionUpdateFormStructureProps) => {
  const labelField: Field<TextFieldProps> = {
    id: "label",
    label: "Region Label",
    variant: FieldVariant.TEXT,
    required: true,
    placeholder: "Enter region label",
    description: "The label for the region.",
    error: regionStore.updateDtoErrors?.label?.[0],
    props: {
      value: regionStore.updateDto.label || undefined,
      onChange: (value) => {
        regionStore.setNested("updateDto.label", value);
        regionStore.setNested("updateDtoErrors.label", []);
      },
    },
  };

  const regionUpdateFormStructure: FormStructure = {
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
    regionUpdateFormStructure,
  };
};
