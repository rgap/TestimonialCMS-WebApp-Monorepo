"use client";

import "@/app/globals.css";
import { Button } from "@/components/ui";
import { notFound } from "next/navigation";

const variants = ["primary", "secondary", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function ButtonPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-6 py-10">
      {/* HEADER */}
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Components
        </p>
        <h1 className="text-3xl font-bold">Button</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          All variant and size combinations of the Button component, plus disabled and href states.
        </p>
      </header>

      {/* MATRIX: VARIANT x SIZE */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Variants × sizes</h2>
          <p className="text-xs text-neutral-500">
            Every variant combined with every size.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Variant
                </th>
                {sizes.map((size) => (
                  <th
                    key={size}
                    className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr
                  key={variant}
                  className="align-top"
                >
                  <td className="border-b px-3 py-3 text-xs font-medium capitalize text-neutral-700">
                    {variant}
                  </td>
                  {sizes.map((size) => (
                    <td
                      key={`${variant}-${size}`}
                      className="border-b px-3 py-3"
                    >
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={variant}
                          size={size}
                        >
                          {variant} / {size}
                        </Button>
                        <p className="text-[11px] text-neutral-500">
                          Props: variant = {variant}, size = {size}
                        </p>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* DISABLED STATES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Disabled combinations</h2>
          <p className="text-xs text-neutral-500">
            Same matrix, all with disabled = true.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Variant
                </th>
                {sizes.map((size) => (
                  <th
                    key={size}
                    className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                  >
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr
                  key={variant}
                  className="align-top"
                >
                  <td className="border-b px-3 py-3 text-xs font-medium capitalize text-neutral-700">
                    {variant}
                  </td>
                  {sizes.map((size) => (
                    <td
                      key={`${variant}-${size}-disabled`}
                      className="border-b px-3 py-3"
                    >
                      <div className="flex flex-col gap-2">
                        <Button
                          variant={variant}
                          size={size}
                          disabled
                        >
                          {variant} / {size} / disabled
                        </Button>
                        <p className="text-[11px] text-neutral-500">
                          Props: variant = {variant}, size = {size}, disabled =
                          true
                        </p>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* HREF STATES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Href (as link)</h2>
          <p className="text-xs text-neutral-500">
            Each variant used as a link with href.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {variants.map((variant) => (
            <div
              key={`href-${variant}`}
              className="space-y-2 rounded-lg border p-4"
            >
              <Button
                href="/dev/button"
                variant={variant}
              >
                {variant} link
              </Button>
              <p className="text-[11px] text-neutral-500">
                Props: href = /dev/button, variant = {variant}, size = md
                (default)
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
