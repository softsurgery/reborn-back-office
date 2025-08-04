import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/shared/Sheets";
import { Spinner } from "@/components/shared/Spinner";
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
      <div className="flex items-center gap-2">
        <MessageCircle />
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
      />
    ),
    className: "min-w-[25vw]",
    onToggle: resetRegion,
  });

  return {
    updateRegionSheet,
    openUpdateRegionSheet,
    closeUpdateRegionSheet,
  };
};
