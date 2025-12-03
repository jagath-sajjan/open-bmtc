"use client";

export default function BrutalInput({ className = "", ...props }) {
  return <input className={`brutal-input ${className}`} {...props} />;
}
