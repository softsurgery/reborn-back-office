import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ResponsiveSidebar } from "./ResponsiveSidebar";
import { MenuItem } from "./StaticMenu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { ModeToggle } from "../Common/ModeToggle";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { Breadcrumb } from "../Common/Breadcrumb";

interface HeaderProps {
  className?: string;
  items?: MenuItem[];
}

export const Header: React.FC<HeaderProps> = ({ className, items }) => {
  const router = useRouter();
  const { routes } = useBreadcrumb();

  return (
    <header className="sticky top-0 z-30 flex min-h-14 items-center gap-4 border-b bg-background px-4">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={cn("sm:max-w-xs", className)}>
          <ResponsiveSidebar items={items} />
        </SheetContent>
      </Sheet>
      <Breadcrumb routes={routes} />
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <User />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/sign-out")}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
