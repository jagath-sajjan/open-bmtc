"use client";
import { useEffect, useMemo, useState } from "react";
import BrutalInput from "../../components/BrutalInput";
import BrutalButton from "../../components/BrutalButton";
import RouteView from "../../components/RouteView";

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error("load failed");
  return res.json();
}

export default function RouteSearchClient({ initialQ = "" }) {
  const [q, setQ] = useState(initialQ);
  const [route, setRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [routesAll, setRoutesAll] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const normalize = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalized = useMemo(() => normalize(q.trim()), [q]);

  const search = async () => {
    setError("");
    setLoading(true);
    try {
      const [routes, trips, stopsData, stopTimes] = await Promise.all([
        loadJson("/data/routes.json"),
        loadJson("/data/trips.json"),
        loadJson("/data/stops.json"),
        loadJson("/data/stop_times.json"),
      ]);
      const exact =
        routes.find((r) => normalize(r.route_short_name) === normalized) ||
        routes.find((r) => normalize(r.route_id) === normalized);
      const candidates = exact
        ? [exact]
        : routes.filter((r) =>
            normalize(r.route_short_name).includes(normalized) ||
            normalize(r.route_id).includes(normalized) ||
            (r.route_long_name || "").toLowerCase().includes(q.trim().toLowerCase())
          );
      const match = candidates[0];
      if (!match) {
        setRoute(null);
        setStops([]);
        setError("No route found");
        setLoading(false);
        return;
      }
      const tripsForRoute = trips.filter((t) => t.route_id === match.route_id);
      const trip = (() => {
        if (tripsForRoute.length === 0) return null;
        let best = null;
        let bestLen = -1;
        for (const t of tripsForRoute) {
          const len = stopTimes.filter((st) => st.trip_id === t.trip_id).length;
          if (len > bestLen) {
            best = t;
            bestLen = len;
          }
        }
        return best;
      })();
      if (!trip) {
        setRoute(match);
        setStops([]);
        setError("No trips for route");
        setLoading(false);
        return;
      }
      const times = stopTimes
        .filter((st) => st.trip_id === trip.trip_id)
        .sort((a, b) => (a.stop_sequence || 0) - (b.stop_sequence || 0));
      const indexedStops = new Map(stopsData.map((s) => [s.stop_id, s]));
      const timeline = times.map((t) => {
        const s = indexedStops.get(t.stop_id);
        return {
          stop_id: t.stop_id,
          stop_name: s?.stop_name || String(t.stop_id),
          arrival_time: t.arrival_time,
        };
      });
      setRoute(match);
      setStops(timeline);
    } catch (e) {
      setError("Data load error");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!routesAll.length) {
      const run = async () => {
        try {
          const rs = await loadJson("/data/routes.json");
          setRoutesAll(rs);
        } catch {}
      };
      run();
    }
  }, [routesAll.length]);

  useEffect(() => {
    if (!routesAll.length) {
      setSuggestions([]);
      return;
    }
    const n = normalized;
    if (!n) {
      setSuggestions(routesAll.slice(0, 12));
      return;
    }
    const list = routesAll
      .filter((r) => {
        const a = normalize(r.route_short_name);
        const b = normalize(r.route_id);
        return a.includes(n) || b.includes(n);
      })
      .slice(0, 12);
    setSuggestions(list);
  }, [normalized, routesAll]);

  useEffect(() => {
    if (normalized) search();
  }, []);

  return (
    <div className="brutal-grid">
      <section className="brutal-card">
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">Route</div>
        <form className="mt-6 brutal-grid" onSubmit={(e) => { e.preventDefault(); search(); }}>
          <BrutalInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., 402-B" />
          <BrutalButton type="submit" disabled={loading}>{loading ? "LOADING" : "SEARCH"}</BrutalButton>
        </form>
        {error && <div className="mt-4 font-mono text-sm text-red-500">{error}</div>}
      </section>
      {suggestions.length > 0 && (
        <section className="brutal-card">
          <div className="text-2xl md:text-3xl font-extrabold tracking-tight">Suggestions</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suggestions.map((r) => (
              <button
                key={r.route_id}
                className="brutal-chip w-full text-left"
                onClick={() => {
                  setQ(r.route_short_name || r.route_id);
                  setTimeout(() => search(), 0);
                }}
              >
                <div className="font-bold">{r.route_short_name || r.route_id}</div>
                <div className="font-mono text-xs md:text-sm text-gray-300">{r.route_long_name}</div>
              </button>
            ))}
          </div>
        </section>
      )}
      {route && <RouteView route={route} stops={stops} />}
    </div>
  );
}
