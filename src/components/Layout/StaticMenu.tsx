import { Shield, Settings, FileStackIcon } from "lucide-react";

export interface MenuItem {
  id: number;
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const items: MenuItem[] = [
  {
    id: 1,
    title: "Users Management",
    href: "/users-management/permissions",
    icon: <Shield />,
  },
  {
    id: 2,
    title: "File Management",
    href: "/file-management",
    icon: <FileStackIcon />,
  },
  {
    id: 3,
    title: "Settings",
    href: "/settings",
    icon: <Settings />,
  },
];
