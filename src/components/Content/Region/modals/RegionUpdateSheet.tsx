import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegionForm } from "../RegionForm";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";

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
      <div>
        <RegionForm />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              updateRegion?.();
            }}
          >
            Save
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetRegion?.();
              closeUpdateRegionSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
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
