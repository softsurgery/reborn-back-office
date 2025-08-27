import { Separator } from "@radix-ui/react-separator";
import { BreadcrumbCommon } from "../shared/Breadcrumb";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useIntro } from "@/contexts/IntroContext";

interface PageHeaderProps {
  className?: string;
}
export const PageHeader = ({ className }: PageHeaderProps) => {
  const { routes } = useBreadcrumb();
  const { title, description, floating } = useIntro();
  return (
    <div className={className}>
      <div className="flex flex-row items-center justify-between">
        {/* Header */}
        <div>
          <BreadcrumbCommon hierarchy={routes} />
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {/* Floating Actions */}
        <div>{floating}</div>
      </div>

      <Separator className="mt-2" />
    </div>
  );
};
