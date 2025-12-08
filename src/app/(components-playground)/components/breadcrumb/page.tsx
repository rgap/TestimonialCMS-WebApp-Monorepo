"use client";

import "@/app/globals.css";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui";
import { notFound } from "next/navigation";

export default function BreadcrumbPageComponent() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-6 py-10">
      {/* HEADER */}
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Components
        </p>
        <h1 className="text-3xl font-bold">Breadcrumb</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          A few common Breadcrumb combinations: basic path, ellipsis and custom
          link.
        </p>
      </header>

      {/* 1) BASIC PATH */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Basic path</h2>

        <div className="space-y-2 rounded-lg border p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/projects">
                  Projects
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/projects/empresa-temporal">
                  Empresa Temporal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Capture forms</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="text-[11px] text-neutral-500">
            Props: links for Home, Projects and Empresa Temporal with href; page
            item for Capture forms (no href).
          </p>
        </div>
      </section>

      {/* 2) LONG PATH WITH ELLIPSIS */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Long path with ellipsis</h2>

        <div className="space-y-2 rounded-lg border p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/projects/empresa-temporal">
                  Empresa Temporal
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Embed configuration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="text-[11px] text-neutral-500">
            Props: ellipsis item in the middle; links before and after; page
            item at the end.
          </p>
        </div>
      </section>

      {/* 3) CUSTOM LINK (AS CHILD) */}
      <section className="space-y-3 pb-6">
        <h2 className="text-base font-semibold">Custom link (asChild)</h2>

        <div className="space-y-2 rounded-lg border p-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button
                    type="button"
                    onClick={() => {
                      // custom navigation logic
                    }}
                  >
                    Custom home
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Current section</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <p className="text-[11px] text-neutral-500">
            Props: BreadcrumbLink with asChild; button provides type and
            onClick; page item for Current section.
          </p>
        </div>
      </section>
    </main>
  );
}
