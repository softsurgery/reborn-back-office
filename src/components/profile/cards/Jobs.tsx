import React from "react";
import { JobPortal } from "@/components/services-management/jobs/JobPortal";

interface JobsProps {
  className?: string;
  userId?: string;
}

export const Jobs = ({ className, userId }: JobsProps) => {
  return <JobPortal userId={userId} className={className} />;
};
