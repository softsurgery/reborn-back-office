import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { ModeToggle } from "../shared/ModeToggle";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { Commander } from "../shared/Commander";
import { UserNav } from "./UserNav";
import { BreadcrumbCommon } from "../shared/Breadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

interface HeaderProps {
  className?: string;
}

export const Header = ({ className }: HeaderProps) => {
  const { routes } = useBreadcrumb();
  return (
    <header
      className={cn(
        "flex h-14 items-center gap-2 border-b px-4 lg:h-[60px] lg:px-6 w-full",
        className,
      )}
    >
      <SidebarTrigger />
      <Commander />
      <BreadcrumbCommon hierarchy={routes} />

      <div className="flex justify-center items-center gap-4 ml-auto">
        <LanguageSwitcher />
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
};
