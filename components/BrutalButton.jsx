"use client";

export default function BrutalButton({ children, className = "", ...props }) {
  return (
    <button className={`brutal-button ${className}`} {...props}>
      {children}
    </button>
  );
}
