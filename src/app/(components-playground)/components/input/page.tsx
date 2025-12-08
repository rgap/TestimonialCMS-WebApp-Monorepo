"use client";

import "@/app/globals.css";
import { Input } from "@/components/ui";
import { notFound } from "next/navigation";

const types = ["text", "email", "password", "number"] as const;

export default function InputPage() {
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
        <h1 className="text-3xl font-bold">Input</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          Common Input combinations: different types, helper text, error,
          disabled and read-only states.
        </p>
      </header>

      {/* SECTION: TYPES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Types</h2>
          <p className="text-xs text-neutral-500">
            One example for each input type.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-neutral-50">
              <tr>
                <th className="border-b px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Type
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
              {types.map((type) => (
                <tr
                  key={type}
                  className="align-top"
                >
                  <td className="border-b px-3 py-3 text-xs font-medium capitalize text-neutral-700">
                    {type}
                  </td>
                  <td className="border-b px-3 py-3">
                    <Input
                      type={type}
                      label={
                        type === "text"
                          ? "Project name"
                          : type === "email"
                          ? "Owner email"
                          : type === "password"
                          ? "API token"
                          : "Import count"
                      }
                      placeholder={
                        type === "text"
                          ? "e.g. Empresa Temporal"
                          : type === "email"
                          ? "you@example.com"
                          : type === "password"
                          ? "••••••••••••"
                          : "10"
                      }
                    />
                  </td>
                  <td className="border-b px-3 py-3 align-middle">
                    <p className="text-[11px] text-neutral-500">
                      Props: type = {type}, label set to a short field name,{" "}
                      placeholder set to an example value.
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION: HELPER TEXT VS ERROR */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Helper text and error</h2>
          <p className="text-xs text-neutral-500">
            How helperText and error look with the same field.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-4">
            <Input
              label="Workspace URL"
              placeholder="your-company"
              helperText="Shown in your public testimonial links."
            />
            <p className="text-[11px] text-neutral-500">
              Props: helperText set to a short hint, error not set so the field
              is in normal state.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <Input
              label="Workspace URL"
              placeholder="your-company"
              error="This workspace URL is already taken."
            />
            <p className="text-[11px] text-neutral-500">
              Props: error set with a specific message, helperText not used,{" "}
              error styling applied automatically.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DISABLED / READ-ONLY */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Disabled and read-only</h2>
          <p className="text-xs text-neutral-500">Non-editable variations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-4">
            <Input
              label="Project ID"
              defaultValue="proj_6789abc"
              readOnly
            />
            <p className="text-[11px] text-neutral-500">
              Props: defaultValue set to a fixed identifier, readOnly = true so
              the value is visible but cannot be changed.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <Input
              label="Billing email"
              defaultValue="billing@example.com"
              disabled
            />
            <p className="text-[11px] text-neutral-500">
              Props: defaultValue set to an existing email, disabled = true so
              the field is visually and functionally disabled.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
