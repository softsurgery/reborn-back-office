import { UserProfile } from "@/components/profile/UserProfile";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <UserProfile id={id as string} />;
}
