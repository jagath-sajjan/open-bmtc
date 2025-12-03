"use client";
import Link from "next/link";

export default function BusChip({ number, href }) {
  const content = <div className="brutal-chip">{number}</div>;
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
