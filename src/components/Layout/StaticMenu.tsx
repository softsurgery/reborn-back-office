import { Shield, Settings } from "lucide-react";

export interface MenuItem {
  id: number;
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const items: MenuItem[] = [
  {
    id: 1,
    title: "Gestion des utilisateurs",
    href: "/users-management/permissions",
    icon: <Shield />,
  },
  {
    id: 2,
    title: "Paramètres",
    href: "/settings",
    icon: <Settings />,
  },
];
