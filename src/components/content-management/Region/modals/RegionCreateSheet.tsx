import { Globe } from "lucide-react";
import { RegionCreateForm } from "../forms/RegionCreateForm";
import { useSheet } from "@/components/shared/Sheets";
import { useTranslation } from "react-i18next";

interface RegionCreateSheetProps {
  createRegion?: () => void;
  isCreatePending?: boolean;
  resetRegion?: () => void;
}

export const useRegionCreateSheet = ({
  createRegion,
  isCreatePending,
  resetRegion,
}: RegionCreateSheetProps) => {
  const { t } = useTranslation("region");

  const {
    SheetFragment: createRegionSheet,
    openSheet: openCreateRegionSheet,
    closeSheet: closeCreateRegionSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Globe />
        Create Region
      </div>
    ),
    description: "Fill out the region details below.",
    children: (
      <RegionCreateForm
        className="my-4"
        regionCallback={createRegion}
        cancelCallback={() => {
          closeCreateRegionSheet?.();
          resetRegion?.();
        }}
        isPending={isCreatePending}
      />
    ),
    className: "min-w-[25vw]",
    onToggle: resetRegion,
  });

  return {
    createRegionSheet,
    openCreateRegionSheet,
    closeCreateRegionSheet,
  };
};
