import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";
import React from "react";
import { files } from "./data";
import { ResourceCard } from "./ResourceCard";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ResourcesProps {
  className?: string;
  type: "public" | "private";
}

export const Resources = ({ className, type }: ResourcesProps) => {
  const pageName = `${type.charAt(0).toUpperCase()}${type.slice(1)} Resources`;
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setRoutes?.([
      { title: "Resources" },
      {
        title: pageName,
        href: `/cardinal/${type}-resources`,
      },
    ]);
    setIntro?.(pageName, `View, create, and manage your ${type} resources.`);
    return () => {
      clearRoutes?.();
      clearIntro?.();
    };
  }, []);
  return (
    <div
      className={cn(
        "flex flex-col flex-1 overflow-hidden rounded-xl p-2 pb-4",
        className
      )}
    >
      <div className="flex flex-row justify-center items-center gap-4 ">
        <Input placeholder="Search resources" className="mb-4" />
        <Button variant="default" className="mb-4">
          Add Resource
        </Button>
      </div>
      <div className="flex flex-col flex-1 overflow-auto no-scrollbar p-5 border rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map((file) => (
            <ResourceCard resource={file} key={file.id} />
          ))}
        </div>
      </div>
    </div>
  );
};
