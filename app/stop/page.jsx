"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrutalInput from "../../components/BrutalInput";
import BrutalButton from "../../components/BrutalButton";
import StopCard from "../../components/StopCard";
import StopModal from "../../components/StopModal";
import BusChip from "../../components/BusChip";

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("load failed");
  return res.json();
}

export default function StopPage() {
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const [q, setQ] = useState(initialQ);
  const [stops, setStops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalized = useMemo(() => q.trim().toLowerCase(), [q]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const s = await loadJson("/data/stops.json");
        const deduped = (() => {
          const seen = new Set();
          const out = [];
          for (const x of s) {
            const key = (x.stop_name || "").trim().toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              out.push(x);
            }
          }
          return out;
        })();
        setStops(deduped);
        setFiltered(
          normalized
            ? deduped.filter((x) => (x.stop_name || "").toLowerCase().includes(normalized))
            : deduped.slice(0, 30)
        );
      } catch (e) {
        setError("Data load error");
      }
      setLoading(false);
    };
    run();
  }, []);

  const search = () => {
    setFiltered(
      normalized
        ? stops.filter((x) => (x.stop_name || "").toLowerCase().includes(normalized))
        : stops.slice(0, 30)
    );
  };

  const openStop = async (stop) => {
    setSelected(stop);
    try {
      const [routes, trips, stopTimes] = await Promise.all([
        loadJson("/data/routes.json"),
        loadJson("/data/trips.json"),
        loadJson("/data/stop_times.json"),
      ]);
      const times = stopTimes.filter((st) => st.stop_id === stop.stop_id);
      const tripIds = new Set(times.map((t) => t.trip_id));
      const tripsById = new Map(trips.map((t) => [t.trip_id, t]));
      const routeIds = new Set(Array.from(tripIds).map((id) => tripsById.get(id)?.route_id).filter(Boolean));
      const list = routes.filter((r) => routeIds.has(r.route_id));
      const dedupRoutes = (() => {
        const seen = new Set();
        const out = [];
        for (const r of list) {
          const key = r.route_id;
          if (!seen.has(key)) {
            seen.add(key);
            out.push(r);
          }
        }
        return out;
      })();
      dedupRoutes.sort((a, b) => (a.route_short_name || "").localeCompare(b.route_short_name || ""));
      setBuses(dedupRoutes);
    } catch (e) {
      setBuses([]);
    }
  };

  return (
    <div className="brutal-grid">
      <section className="brutal-card">
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">Stops</div>
        <form className="mt-6 brutal-grid" onSubmit={(e) => { e.preventDefault(); search(); }}>
          <BrutalInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., KR Market" />
          <BrutalButton type="submit" disabled={loading}>{loading ? "LOADING" : "SEARCH"}</BrutalButton>
        </form>
        {error && <div className="mt-4 font-mono text-sm text-red-500">{error}</div>}
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <StopCard key={s.stop_id} stop={s} onClick={openStop} />
        ))}
      </section>
      <StopModal stop={selected} buses={buses} onClose={() => setSelected(null)} />
    </div>
  );
}
