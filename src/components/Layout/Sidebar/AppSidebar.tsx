import * as React from "react";
import {
  BriefcaseBusiness,
  Frame,
  Map,
  MessageCircle,
  PieChart,
  Tablet,
  TabletSmartphone,
  Users,
  Bug,
  Package,
  WandSparkles,
  Paperclip,
  MapIcon,
  FileLock,
  FileUser,
  CloudUpload,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MainNav } from "./MainNav";
import { TeamSwitcher } from "./TeamSwitcher";
import { UserNav } from "./UserNav";
import { useSession } from "next-auth/react";
import { useEmailUser } from "@/hooks/content/useEmailUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useSession();
  const { user } = useEmailUser(userData?.user.email);
  const data = {
    user: {
      name:
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.username || "",
      email: userData?.user.email || "",
      avatar: "/avatars/shadcn.jpg",
      avataralt:
        user?.firstName && user?.lastName
          ? `${user?.firstName?.charAt(0).toUpperCase()}${user?.lastName
              ?.charAt(0)
              .toUpperCase()}`
          : user?.username?.charAt(0).toUpperCase() || "",
    },
    teams: [
      {
        name: "Reborn Back Office",
        logo: BriefcaseBusiness,
      },
    ],
    navMain: [
      {
        id: 1,
        title: "User Management",
        icon: Users,
        items: [
          {
            title: "Users",
            url: "/user-management/users",
            icon: Users,
          },
          {
            title: "Roles",
            url: "/user-management/roles",
            icon: Package,
          },
          {
            title: "Permissions",
            url: "/user-management/permissions",
            icon: WandSparkles,
          },
        ],
      },
      {
        id: 2,
        title: "System Reports",
        url: "/system-reports",
        icon: TabletSmartphone,
        items: [
          {
            title: "Feedbacks",
            url: "/system-reports/feedbacks",
            icon: MessageCircle,
          },
          {
            title: "Bugs",
            url: "/system-reports/bugs",
            icon: Bug,
          },
          {
            title: "Devices",
            url: "/system-reports/deviceInfos",
            icon: Tablet,
          },
        ],
      },
      {
        id: 3,
        title: "Content Management",
        url: "/content-management",
        icon: Paperclip,
        items: [
          {
            title: "Regions",
            url: "/content/regions",
            icon: MapIcon,
          },
        ],
      },
      {
        id: 4,
        title: "Resources",
        url: "/content-management",
        icon: CloudUpload,
        items: [
          {
            title: "Public Resources",
            url: "/cardinal/public-resources",
            icon: FileUser,
          },
          {
            title: "Private Resources",
            url: "/cardinal/private-resources",
            icon: FileLock,
          }
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* @ts-ignore */}
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {/* @ts-ignore */}
        <MainNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <UserNav user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
