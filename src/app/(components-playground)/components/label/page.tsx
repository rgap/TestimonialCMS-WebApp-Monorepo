"use client";

import "@/app/globals.css";
import { Input, Label } from "@/components/ui";
import { notFound } from "next/navigation";

export default function LabelPage() {
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
        <h1 className="text-3xl font-bold">Label</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          Label paired with inputs: default, required, optional, disabled and
          read-only cases.
        </p>
      </header>

      {/* SECTION: BASIC LABEL + INPUT */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Basic</h2>
          <p className="text-xs text-neutral-500">Simple htmlFor + id pairs.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Project name */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-project-name">Project name</Label>
            <Input
              id="label-project-name"
              placeholder="e.g. Empresa Temporal"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-project-name, children = Project
              name. Input id = label-project-name, placeholder set to an example
              value.
            </p>
          </div>

          {/* Owner email */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-owner-email">Owner email</Label>
            <Input
              id="label-owner-email"
              type="email"
              placeholder="you@example.com"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-owner-email, children = Owner email.
              Input id = label-owner-email, type = email, placeholder set.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: REQUIRED / OPTIONAL */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Required vs optional</h2>
          <p className="text-xs text-neutral-500">
            Same pattern with required marker and optional hint.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Required */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-required-email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="label-required-email"
              type="email"
              placeholder="you@example.com"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-required-email, children = Email with
              * span. Input id = label-required-email, type = email, placeholder
              set.
            </p>
          </div>

          {/* Optional */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-optional-company">
              Company name{" "}
              <span className="text-xs text-neutral-500">(optional)</span>
            </Label>
            <Input
              id="label-optional-company"
              placeholder="Your company"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-optional-company, children includes
              small optional hint. Input id = label-optional-company,
              placeholder set.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: LONG LABELS */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Longer labels</h2>
          <p className="text-xs text-neutral-500">
            Labels with more descriptive copy.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Long label 1 */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-long-1">
              Short public name shown on your testimonial widgets
            </Label>
            <Input
              id="label-long-1"
              placeholder="e.g. Empresa Temporal"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-long-1, children is a full sentence.
              Input id = label-long-1, placeholder set.
            </p>
          </div>

          {/* Long label 2 */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-long-2">
              Internal reference used only inside your workspace
            </Label>
            <Input
              id="label-long-2"
              placeholder="Internal reference"
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-long-2, children is descriptive label
              text. Input id = label-long-2, placeholder set.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DISABLED / READ-ONLY PAIRING */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Disabled and read-only</h2>
          <p className="text-xs text-neutral-500">
            Same Label pattern with non-editable inputs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Read-only */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-readonly-id">Project ID</Label>
            <Input
              id="label-readonly-id"
              defaultValue="proj_6789abc"
              readOnly
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-readonly-id, children = Project ID.
              Input id = label-readonly-id, defaultValue set, readOnly = true.
            </p>
          </div>

          {/* Disabled */}
          <div className="space-y-2 rounded-lg border p-4">
            <Label htmlFor="label-disabled-billing">Billing email</Label>
            <Input
              id="label-disabled-billing"
              defaultValue="billing@example.com"
              disabled
            />
            <p className="text-[11px] text-neutral-500">
              Props: Label htmlFor = label-disabled-billing, children = Billing
              email. Input id = label-disabled-billing, defaultValue set,
              disabled = true.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
