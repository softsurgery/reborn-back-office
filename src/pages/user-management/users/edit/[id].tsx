"use client";

import { useParams } from "next/navigation";
import { UserUpdatePage } from "@/components/administrative-tools/user-management/users/modals/UserUpdateSheet";

export default function Page() {
  const { id } = useParams();

  return <UserUpdatePage id={id as string} />;
}
