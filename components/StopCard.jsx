"use client";

export default function StopCard({ stop, onClick }) {
  return (
    <button className="brutal-card text-left w-full transition-opacity duration-150 hover:opacity-80" onClick={() => onClick?.(stop)}>
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight">{stop.stop_name}</div>
      <div className="mt-2 font-mono text-xs md:text-sm text-gray-300">{stop.stop_lat}, {stop.stop_lon}</div>
    </button>
  );
}
