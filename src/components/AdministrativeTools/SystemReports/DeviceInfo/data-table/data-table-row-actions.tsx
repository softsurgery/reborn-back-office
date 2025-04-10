import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeviceInfo } from "@/types";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { CopyIcon, Settings2, Telescope, Trash2 } from "lucide-react";
import { useDeviceInfoStore } from "@/hooks/stores/useDeviceInfoStore";

interface DataTableRowActionsProps {
  row: Row<DeviceInfo>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const deviceInfo = row.original;

  const deviceInfoManager = useDeviceInfoStore();

  const targetDeviceInfo = () => {
    deviceInfoManager.setDeviceInfo(deviceInfo);
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
