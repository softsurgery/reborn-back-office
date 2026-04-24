import { JobDetails } from "@/components/services-management/jobs/JobDetails";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { query, isReady } = router;
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  if (!isReady || !id) {
    return null;
  }

  return <JobDetails jobId={id as string} />;
}
