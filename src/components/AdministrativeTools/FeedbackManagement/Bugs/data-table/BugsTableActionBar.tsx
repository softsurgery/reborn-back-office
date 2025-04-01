"use client";

import React from "react";
import { Table } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DataTableActionBar,
  DataTableActionBarAction,
} from "@/components/AdministrativeTools/FeedbackManagement/Bugs/data-table/data-table-action-bar";
import { useBugManager } from "@/hooks/stores/useBugManager";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useBugDeleteDialog } from "@/components/AdministrativeTools/FeedbackManagement/Bugs/modals/BugDeleteDialog";

interface BugsTableActionBarProps {
  table: Table<any>;
}

export function BugsTableActionBar({ table }: BugsTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const bugManager = useBugManager();
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBug, isPending: isDeletionPending } = useMutation({
    mutationFn: (id: number) => api.admin.bug.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { deleteBugDialog, openDeleteBugDialog, closeDeleteBugDialog } = useBugDeleteDialog({
    deleteBug: async () => {
      const ids = rows.map((row) => row.original.id);
      await Promise.all(ids.map((id) => deleteBug(id)));
      ids.forEach((id) => bugManager.removeBug(id));
      table.toggleAllRowsSelected(false);
      bugManager.reset();
      toast(`${ids.length} bug${ids.length > 1 ? "s" : ""} deleted successfully`);
    },
    isDeletionPending,
    resetBug: () => bugManager.reset(),
  });

  const onBugDelete = React.useCallback(() => {
    openDeleteBugDialog();
  }, [openDeleteBugDialog]);

  return (
    <TooltipProvider>
      <DataTableActionBar table={table} visible={rows.length > 0}>
        <div className="flex h-7 items-center rounded-md border pr-1 pl-2.5">
          <span className="whitespace-nowrap text-xs">
            {rows.length} selected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <DataTableActionBarAction
            size="icon"
            tooltip="Delete bugs"
            isPending={isPending || isDeletionPending}
            onClick={onBugDelete}
          >
            <Trash2 />
          </DataTableActionBarAction>
        </div>
      </DataTableActionBar>
      {deleteBugDialog}
    </TooltipProvider>
  );
}
