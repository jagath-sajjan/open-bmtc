import { Suspense } from "react";
import RouteSearchClient from "./RouteSearchClient";

export default function RoutePage({ searchParams }) {
  const initialQ = searchParams?.q || "";
  return (
    <Suspense>
      <RouteSearchClient initialQ={initialQ} />
    </Suspense>
  );
}
