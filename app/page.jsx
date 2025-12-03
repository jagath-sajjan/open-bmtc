"use client";
import { useRouter } from "next/navigation";
import BrutalInput from "../components/BrutalInput";
import BrutalButton from "../components/BrutalButton";

export default function HomePage() {
  const router = useRouter();
  const onRouteSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget.route.value.trim();
    if (!value) return;
    router.push(`/route?q=${encodeURIComponent(value)}`);
  };
  const onStopSearch = (e) => {
    e.preventDefault();
    const value = e.currentTarget.stop.value.trim();
    if (!value) return;
    router.push(`/stop?q=${encodeURIComponent(value)}`);
  };
  return (
    <div className="brutal-grid">
      <section className="brutal-card">
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">Bus Number Search</div>
        <div className="mt-2 text-lg md:text-xl text-gray-300">Enter a route number</div>
        <form className="mt-6 brutal-grid" onSubmit={onRouteSearch}>
          <BrutalInput name="route" placeholder="e.g., 402-B" />
          <BrutalButton type="submit">SEARCH ROUTE</BrutalButton>
        </form>
      </section>

      <section className="brutal-card">
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">Stop Search</div>
        <div className="mt-2 text-lg md:text-xl text-gray-300">Enter a stop name</div>
        <form className="mt-6 brutal-grid" onSubmit={onStopSearch}>
          <BrutalInput name="stop" placeholder="e.g., KR Market" />
          <BrutalButton type="submit">SEARCH STOP</BrutalButton>
        </form>
      </section>
    </div>
  );
}
