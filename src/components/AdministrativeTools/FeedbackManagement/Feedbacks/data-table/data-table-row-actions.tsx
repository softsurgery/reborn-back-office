import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Feedback } from "@/types/feedback";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Telescope, Trash2 } from "lucide-react";
import { useFeedbackActions } from "./action-context";
import { useFeedbackManager } from "../hooks/useFeedbackManager";

interface DataTableRowActionsProps {
  row: Row<Feedback>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const feedback = row.original;
  const { openDeleteFeedbackDialog } = useFeedbackActions();

  const feedbackManager = useFeedbackManager();

  const targetFeedback = () => {
    feedbackManager.setFeedback(feedback);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">Actions </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <Telescope className="h-5 w-5 mr-2" /> Inspect
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            targetFeedback();
            openDeleteFeedbackDialog();
          }}
        >
          <Trash2 className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
