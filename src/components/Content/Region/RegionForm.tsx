import { FormBuilder } from "@/components/Common/FormBuilder/FormBuilder";
import { useRegionStore } from "@/hooks/stores/useRegionStore";
import { cn } from "@/lib/utils";
import { DynamicForm } from "@/types";
interface RegionFormProps {
  className?: string;
}

export const RegionForm = ({ className }: RegionFormProps) => {
  const regionStore = useRegionStore();
  const form: DynamicForm = {
    name: "Region Information",
    description: "Fill in the required fields to create a new region.",
    orientation: "vertical",
    grids: [
      {
        name: "General Information",
        description: "General information about the region.",
        includeHeader: true,
        gridItems: [
          {
            id: 1,
            fields: [
              {
                label: "Region Label",
                className: "w-full",
                variant: "text",
                required: true,
                description: "The label for the region.",
                props: {
                  value: regionStore.label,
                  onChange: (value) => {
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
    <div
      className={cn(
        "flex flex-col pb-20 overflow-hidden container mx-auto",
        className
      )}
    >
      <FormBuilder form={form} />
    </div>
  );
};
