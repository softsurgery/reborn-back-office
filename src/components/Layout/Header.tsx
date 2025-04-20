import React from "react";
import { cn } from "@/lib/utils";
import { useBreadcrumb } from "../../context/BreadcrumbContext";
import { SidebarTrigger } from "../ui/sidebar";
import { BreadcrumbCommon } from "../Common/Breadcrumb";
import { ModeToggle } from "../Common/ModeToggle";
import { LanguageSwitcher } from "../Common/LanguageSwitcher";
import { SignoutButton } from "../Auth/SignoutButton";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { routes } = useBreadcrumb();

  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 w-full",
        className
      )}
    >
      <SidebarTrigger />
      <BreadcrumbCommon hierarchy={routes} />
      <div className="flex justify-center items-center gap-4 ml-auto">
        <LanguageSwitcher />
        <ModeToggle />
        <SignoutButton />
      </div>
    </header>
  );
};
