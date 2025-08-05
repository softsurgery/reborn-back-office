import { Trans as NativeTrans } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

interface TransProps {
  ns?: string;
  i18nKey?: string;
  values?: Record<string, any>;
  isPending?: boolean;
  className?: string;
  defaults?: string;
}

export const Trans = ({
  ns,
  i18nKey,
  values = {},
  isPending = false,
  className,
  defaults,
}: TransProps) => {
  if (isPending) return <Skeleton className="h-5 w-full" />;
  if (!i18nKey)
    return <span className={className}>Missing translation key</span>;

  return (
    <NativeTrans
      ns={ns}
      i18nKey={i18nKey}
      values={values}
      defaults={defaults}
      className={className}
    />
  );
};
