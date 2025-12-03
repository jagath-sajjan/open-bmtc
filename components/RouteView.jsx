"use client";

export default function RouteView({ route, stops }) {
  if (!route) return null;
  return (
    <div className="brutal-card">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-5xl md:text-6xl font-extrabold leading-none tracking-tight">{route.route_short_name}</div>
          <div className="text-xl md:text-2xl mt-2 text-gray-200">{route.route_long_name}</div>
        </div>
        <div className="font-mono text-xs md:text-sm text-gray-300">ID {route.route_id}</div>
      </div>
      <div className="mt-6 grid grid-cols-[12px_1fr_auto] gap-x-4">
        <div className="border-l-2 border-white"></div>
        <div className="space-y-0">
          {stops.map((s, idx) => (
            <div key={`${s.stop_id}-${idx}`} className="py-3 brutal-sep">
              <div className="flex items-center justify-between">
                <div className="text-xl md:text-2xl font-bold">{s.stop_name}</div>
                <div className="font-mono text-xs md:text-sm text-gray-300">{s.arrival_time}</div>
              </div>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
}
