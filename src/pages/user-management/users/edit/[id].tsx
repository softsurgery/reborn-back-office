import { UpdateUser } from "@/components/administrative-tools/user-management/users/forms/UpdateUser";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  return <UpdateUser id={id as string} />;
}
