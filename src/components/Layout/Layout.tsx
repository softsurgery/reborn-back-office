import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/lib/utils";
import { items } from "./StaticMenu";
import React from "react";
import {
  BreadcrumbContext,
  BreadcrumbRoute,
} from "@/context/BreadcrumbContext";

interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ className, children }) => {
  const [routes, setRoutes] = React.useState<BreadcrumbRoute[]>([]);

  return (
    <BreadcrumbContext.Provider
      value={{
        routes,
        setRoutes,
      }}
    >
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden w-full ",
          className
        )}
      >
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <Sidebar items={items} />
        </aside>

        <div className="flex flex-col flex-1 overflow-hidden sm:pl-14">
          <Header items={items} />
          <main className="flex flex-col flex-1 overflow-hidden w-full">
            {children}
          </main>
        </div>
      </div>
    </BreadcrumbContext.Provider>
  );
};
