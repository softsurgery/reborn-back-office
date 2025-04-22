import { Separator } from "@radix-ui/react-separator";
import { BreadcrumbCommon } from "../Common/Breadcrumb";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { useIntro } from "@/context/IntroContext";

interface PageHeaderProps {
  className?: string;
}
export const PageHeader = ({ className }: PageHeaderProps) => {
  const { routes } = useBreadcrumb();
  const { title, description } = useIntro();
  return (
    <div className={className}>
      <BreadcrumbCommon hierarchy={routes} />
      <h1 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h1>
      <p className="text-muted-foreground text-sm">{description}</p>
      <Separator className="mt-2" />
    </div>
  );
};
