import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RegionForm } from "../RegionForm";
import { useSheet } from "@/components/Common/Sheets";
import { Spinner } from "@/components/Common/Spinner";

interface RegionCreateSheet {
  createRegion?: () => void;
  isCreatePending?: boolean;
  resetRegion?: () => void;
}

export const useRegionCreateSheet = ({
  createRegion,
  isCreatePending,
  resetRegion,
}: RegionCreateSheet) => {
  const {
    SheetFragment: createRegionSheet,
    openSheet: openCreateRegionSheet,
    closeSheet: closeCreateRegionSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <MessageCircle />
        New Region
      </div>
    ),
    description:
      "Use this form to define a new region within the system. A region is identified by their unique id, Fill in all required fields to ensure the region is successfully added.",
    children: (
      <div>
        <RegionForm />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              createRegion?.();
            }}
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetRegion?.();
              closeCreateRegionSheet();
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
    createRegionSheet,
    openCreateRegionSheet,
    closeCreateRegionSheet,
  };
};
