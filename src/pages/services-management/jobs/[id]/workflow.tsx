import { JobDetails } from "@/components/services-management/jobs/JobDetails";
import { useParams } from "next/navigation";

export default function JobWorkflowPage() {
  const { id } = useParams();
  return <JobDetails jobId={id as string} initialTab="workflow" />;
}
