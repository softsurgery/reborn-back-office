import React from "react";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../Common/ModeToggle";
import { LanguageSwitcher } from "../Common/LanguageSwitcher";
import { Commander } from "../Common/Commander";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 w-full",
        className
      )}
    >
      <SidebarTrigger />
      <Commander />
      <div className="flex justify-center items-center gap-4 ml-auto">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </header>
  );
};
