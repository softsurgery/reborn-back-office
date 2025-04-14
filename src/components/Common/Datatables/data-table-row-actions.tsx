import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Edit, Telescope, Trash2 } from "lucide-react";
import React from "react";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  context: {
    triggerInspect?: () => void;
    triggerUpdate?: () => void;
    triggerActivate?: () => void;
    triggerDeactivate?: () => void;
    triggerDuplicate?: () => void;
    triggerDelete?: () => void;
    targetEntity?: (entity: T) => void;
  };
}

export function DataTableRowActions<T>({
  row,
  context,
}: DataTableRowActionsProps<T>) {
  const entity = row.original;
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
        {context?.triggerInspect && (
          <React.Fragment>
            <DropdownMenuItem
              onClick={() => {
                context.targetEntity?.(entity);
                context?.triggerInspect?.();
              }}
            >
              <Telescope className="h-5 w-5 mr-2" /> Inspect
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </React.Fragment>
        )}
        
        {context?.triggerActivate && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.triggerActivate?.();
            }}
          >
            <ArrowUp className="h-5 w-5 mr-2" /> Activate
          </DropdownMenuItem>
        )}
        {context?.triggerDeactivate && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.triggerDeactivate?.();
            }}
          >
            <ArrowDown className="h-5 w-5 mr-2" /> Deactivate
          </DropdownMenuItem>
        )}
        {context?.triggerUpdate && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.triggerUpdate?.();
            }}
          >
            <Edit className="h-5 w-5 mr-2" /> Update
          </DropdownMenuItem>
        )}
        {context?.triggerDelete && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.triggerDelete?.();
            }}
          >
            <Trash2 className="h-5 w-5 mr-2" /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
