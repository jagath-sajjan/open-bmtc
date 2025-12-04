import { Suspense } from "react";
import StopSearchClient from "./StopSearchClient";

export default function StopPage({ searchParams }) {
  const initialQ = searchParams?.q || "";
  return (
    <Suspense>
      <StopSearchClient initialQ={initialQ} />
    </Suspense>
  );
}
