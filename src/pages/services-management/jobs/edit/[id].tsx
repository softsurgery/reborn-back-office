import { UpdateJob } from "@/components/services-management/jobs/forms/UpdateJob";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <UpdateJob id={id as string} />;
}
