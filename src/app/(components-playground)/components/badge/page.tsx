"use client";

import "@/app/globals.css";
import { Badge } from "@/components/ui";
import { notFound } from "next/navigation";

const variants = ["default", "secondary", "destructive", "outline"] as const;

export default function BadgePage() {
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
        <h1 className="text-3xl font-bold">Badge</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          All variant combinations of the Badge component, as plain spans and as
          links (asChild).
        </p>
      </header>

      {/* SECTION: VARIANTS (SPAN) */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Variants (span)</h2>
          <p className="text-xs text-neutral-500">
            Each variant rendered as the default span.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Variant
                </th>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Example
                </th>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Props
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr
                  key={`span-${variant}`}
                  className="align-top"
                >
                  <td className="border-b px-3 py-3 text-xs font-medium capitalize text-neutral-700">
                    {variant}
                  </td>
                  <td className="border-b px-3 py-3">
                    <Badge variant={variant}>
                      {variant === "default"
                        ? "Default"
                        : variant.charAt(0).toUpperCase() + variant.slice(1)}
                    </Badge>
                  </td>
                  <td className="border-b px-3 py-3 align-middle">
                    <p className="text-[11px] text-neutral-500">
                      Props: variant = {variant}, asChild not set (defaults to
                      false), children = short label
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: VARIANTS AS LINK (asChild) */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">
            Variants as link (asChild)
          </h2>
          <p className="text-xs text-neutral-500">
            Same variants, rendered as anchors using asChild.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Variant
                </th>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Example (anchor)
                </th>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Props
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((variant) => (
                <tr
                  key={`link-${variant}`}
                  className="align-top"
                >
                  <td className="border-b px-3 py-3 text-xs font-medium capitalize text-neutral-700">
                    {variant}
                  </td>
                  <td className="border-b px-3 py-3">
                    <Badge
                      variant={variant}
                      asChild
                    >
                      <a href="#badge-link">
                        {variant === "default"
                          ? "Default link"
                          : `${variant} link`}
                      </a>
                    </Badge>
                  </td>
                  <td className="border-b px-3 py-3 align-middle">
                    <p className="text-[11px] text-neutral-500">
                      Props: variant = {variant}, asChild = true, children =
                      anchor element with href set
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: DENSE LIST EXAMPLES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Dense usage examples</h2>
          <p className="text-xs text-neutral-500">
            Multiple badges combined in list or card layouts.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Project card
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Empresa Temporal</span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Active</Badge>
                <Badge variant="secondary">Pro plan</Badge>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: first badge variant = default for status, second badge
              variant = secondary for plan tag.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Testimonial row
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">
                Homepage hero testimonial
              </span>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Published</Badge>
                <Badge variant="outline">Homepage</Badge>
                <Badge variant="destructive">Flagged</Badge>
              </div>
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: mix of variants default, outline and destructive to show
              different meanings in the same row.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
