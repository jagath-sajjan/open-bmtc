"use client";

import BusChip from "./BusChip";

export default function StopModal({ stop, buses, onClose }) {
  if (!stop) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
      <div className="brutal-card w-full max-w-md md:max-w-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight">{stop.stop_name}</div>
            <div className="mt-2 font-mono text-xs md:text-sm text-gray-300">{stop.stop_lat}, {stop.stop_lon}</div>
          </div>
          <button className="brutal-chip" onClick={onClose}>Close</button>
        </div>
        <div className="mt-6 brutal-sep"></div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {buses.length === 0 && (
            <div className="font-mono text-sm">No buses found</div>
          )}
          {buses.map((b) => (
            <div key={b.route_id}>
              <BusChip number={b.route_short_name} href={`/route?q=${encodeURIComponent(b.route_short_name)}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
