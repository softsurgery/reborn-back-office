import { IdCard, ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SidebarNav from "@/components/Common/SidebarNav";

interface FileManagementProps {
  className?: string;
  children?: React.ReactNode;
}

export default function FileManagement({
  className,
  children,
}: FileManagementProps) {
  //translations

  //menu items
  const sidebarNavItems = [
    {
      title: "Profile Pictures",
      icon: <ImageIcon size={18} />,
      href: "/files-management/profile-pictures",
    },
    {
      title: "Identity Documents",
      icon: <IdCard size={18} />,
      href: "/files-management/identity-documents",
    },
  ];

  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden m-5 lg:mx-10",
        className
      )}
    >
      <div className="space-y-0.5 py-5 sm:py-0">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          File Management
        </h1>
        <p className="text-muted-foreground">
          Manage and organize your files efficiently. Upload, categorize, and
          access important documents
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex-1 flex flex-col overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 ">
        <aside className="flex-1 mb-2">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex flex-col flex-[7] overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
