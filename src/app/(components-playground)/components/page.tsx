"use client";

import "@/app/globals.css";
import Link from "next/link";
import { notFound } from "next/navigation";

const items = [
  { href: "/components/button", label: "Button" },
  { href: "/components/badge", label: "Badge" },
  { href: "/components/breadcrumb", label: "Breadcrumb" },
  { href: "/components/input", label: "Input" },
  { href: "/components/textarea", label: "Textarea" },
  { href: "/components/toggle-switch", label: "ToggleSwitch" },
];

export default function DevIndexPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <h1 className="text-2xl font-bold mb-4">UI Components – Dev Pages</h1>
      <ul className="list-disc pl-5 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-indigo-600 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
