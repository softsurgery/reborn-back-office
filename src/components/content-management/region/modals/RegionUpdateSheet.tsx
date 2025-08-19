import { MapIcon } from "lucide-react";
import { useSheet } from "@/components/shared/Sheets";
import { RegionUpdateForm } from "../forms/RegionUpdateForm";

interface RegionUpdateSheet {
  updateRegion?: () => void;
  isUpdatePending?: boolean;
  resetRegion?: () => void;
}

export const useRegionUpdateSheet = ({
  updateRegion,
  isUpdatePending,
  resetRegion,
}: RegionUpdateSheet) => {
  const {
    SheetFragment: updateRegionSheet,
    openSheet: openUpdateRegionSheet,
    closeSheet: closeUpdateRegionSheet,
  } = useSheet({
    title: (
      <div className="flex items-center">
        <MapIcon />
        Update Region
      </div>
    ),
    description:
      "Use this form to update an existing region within the system. A region is identified by their unique id, Fill in all required fields to ensure the region is successfully updated.",
    children: (
      <RegionUpdateForm
        regionCallback={updateRegion}
        cancelCallback={() => {
          closeUpdateRegionSheet?.();
          resetRegion?.();
        }}
        isPending={isUpdatePending}
      />
    ),
    className: "min-w-[25vw] flex flex-col flex-1 overflow-hidden",
    onToggle: resetRegion,
  });

  return {
    updateRegionSheet,
    openUpdateRegionSheet,
    closeUpdateRegionSheet,
  };
};
