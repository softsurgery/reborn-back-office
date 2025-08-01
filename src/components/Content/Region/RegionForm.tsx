import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { FieldVariant, FormStructure } from "@/components/shared/form-builder/types";
import { useRegionStore } from "@/hooks/stores/useRegionStore";
import { cn } from "@/lib/utils";
interface RegionFormProps {
  className?: string;
}

export const RegionForm = ({ className }: RegionFormProps) => {
  const regionStore = useRegionStore();
  const form: FormStructure = {
    title: "Region Information",
    description: "Fill in the required fields to create a new region.",
    orientation: "vertical",
    fieldsets: [
      {
        title: "General Information",
        description: "General information about the region.",
        includeHeader: false,
        rows: [
          {
            fields: [
              {
                id: "label",
                label: "Region Label",
                className: "w-full",
                variant: FieldVariant.TEXT,
                required: true,
                description: "The label for the region.",
                error: regionStore.errors.label?.[0],
                props: {
                  value: regionStore.label,
                  onChange: (value: string) => {
                    regionStore.set("label", value);
                    regionStore.resetError("label");
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <div className={cn("my-5", className)}>
      <FormBuilder structure={form}  />
    </div>
  );
};
