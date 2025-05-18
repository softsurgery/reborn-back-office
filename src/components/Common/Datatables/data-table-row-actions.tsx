import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableConfig } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Edit, Telescope, Trash2 } from "lucide-react";
import React from "react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  context: DataTableConfig<TData>;
}

export function DataTableRowActions<TData>({
  row,
  context,
}: DataTableRowActionsProps<TData>) {
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
        {context?.inspectCallback && (
          <React.Fragment>
            <DropdownMenuItem
              onClick={() => {
                context.targetEntity?.(entity);
                context?.inspectCallback?.(entity);
              }}
            >
              <Telescope /> Inspect
            </DropdownMenuItem>
            <DropdownMenuSeparator className="border" />
          </React.Fragment>
        )}

        {Object.values(context?.additionalActions ?? {}).map((group, index) => {
          return (
            <React.Fragment key={index}>
              {group.map((action, index) => {
                if (action.isActionVisible && !action.isActionVisible(entity))
                  return null;

                return (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => {
                      context.targetEntity?.(entity);
                      action.actionCallback?.(entity);
                    }}
                  >
                    {action.actionIcon} {action.actionLabel}
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator className="border" />
            </React.Fragment>
          );
        })}

        {context?.updateCallback && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.updateCallback?.(entity);
            }}
          >
            <Edit /> Update
          </DropdownMenuItem>
        )}
        {context?.deleteCallback && (
          <DropdownMenuItem
            onClick={() => {
              context.targetEntity?.(entity);
              context?.deleteCallback?.(entity);
            }}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
