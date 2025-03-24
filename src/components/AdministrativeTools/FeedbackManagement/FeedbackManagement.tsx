import { Bug, MessageCircle, MessageSquare, Tablet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import SidebarNav from "@/components/Common/SidebarNav";

interface FeedbackProps {
  className?: string;
  children?: React.ReactNode;
}

export default function FeedbackManagement({
  className,
  children,
}: FeedbackProps) {
  //translations

  //menu items
  const sidebarNavItems = [
    {
      title: "Feedbacks",
      icon: <MessageCircle size={18} />,
      href: "/feedbacks-management/feedbacks",
    },
    {
      title: "DeviceInfo",
      icon: <Tablet size={18} />,
      href: "/feedbacks-management/deviceInfos",
    },
    {
      title: "Bugs",
      icon: <Bug size={18} />,
      href: "/feedbacks-management/Bugs",
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
          Feedback Management
        </h1>
        <p className="text-muted-foreground">Manage feedbacks, deviceInfo and bugs within your organization.</p>
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
