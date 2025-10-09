import { Logger } from "@/components/audit-monitoring/logger/Logger";

interface ActivityProps {
  className?: string;
  userId?: string;
}

export const Activity = ({ className, userId }: ActivityProps) => {
  return <Logger userId={userId} className={className} />;
};
