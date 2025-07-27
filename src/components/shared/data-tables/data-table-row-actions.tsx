import React from "react";
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
import { useTranslation } from "react-i18next";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  context: DataTableConfig<TData>;
}

export function DataTableRowActions<TData>({
  row,
  context,
}: DataTableRowActionsProps<TData>) {
  const entity = row.original;

  const { t } = useTranslation("common");

  const targetAndTrigger = (callback: Function) => {
    context.targetEntity?.(entity);
    if (callback) {
      callback(entity);
    }
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

      <DropdownMenuContent align="center" className="w-[160px] font-bold">
        <DropdownMenuLabel className="text-center">{t("common.table.actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {context.inspectCallback && (
          <>
            <DropdownMenuItem
              onClick={() =>
                targetAndTrigger(() => context.inspectCallback?.(entity))
              }
            >
              <Telescope />
              <span className="mx-1">{t("common.buttons.inspect")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {Object.values(context.additionalActions ?? {}).map((group, index) => (
          <React.Fragment key={`group-${index}`}>
            {group.map((action, idx) => {
              if (action.isActionVisible && !action.isActionVisible(entity)) {
                return null;
              }

              return (
                <DropdownMenuItem
                  key={`action-${idx}`}
                  onClick={() =>
                    targetAndTrigger(() => action.actionCallback?.(entity))
                  }
                >
                  {action.actionIcon}
                  <span className="mx-1">{action.actionLabel}</span>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
          </React.Fragment>
        ))}

        {context.updateCallback && (
          <DropdownMenuItem
            onClick={() =>
              targetAndTrigger(() => context.updateCallback?.(entity))
            }
          >
            <Edit />
            <span className="mx-1">{t("common.buttons.edit")}</span>
          </DropdownMenuItem>
        )}

        {context.deleteCallback && (
          <DropdownMenuItem
            onClick={() =>
              targetAndTrigger(() => context.deleteCallback?.(entity))
            }
          >
            <Trash2 />
            <span className="mx-1">{t("common.buttons.delete")}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
