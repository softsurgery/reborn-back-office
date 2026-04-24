import React from "react";
import { useRouter } from "next/router";
import { UpdateJob } from "@/components/services-management/jobs/UpdateJob";

export default function Page() {
  const router = useRouter();
  const { query, isReady } = router;
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  if (!isReady || !id) {
    return null;
  }

  return <UpdateJob id={id} />;
}
