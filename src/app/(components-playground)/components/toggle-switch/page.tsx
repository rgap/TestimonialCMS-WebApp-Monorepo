"use client";

import "@/app/globals.css";
import { ToggleSwitch } from "@/components/ui";
import { notFound } from "next/navigation";
import { useState } from "react";

export default function ToggleSwitchPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [autoPublishOn, setAutoPublishOn] = useState(false);

  return (
    <main className="mx-auto min-h-screen max-w-4xl space-y-8 px-6 py-10">
      {/* HEADER */}
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Components
        </p>
        <h1 className="text-3xl font-bold">ToggleSwitch</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          Basic ToggleSwitch combinations: labeled on/off, controlled and
          disabled.
        </p>
      </header>

      {/* 1) BASIC ON / OFF */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Basic on / off</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* On */}
          <div className="space-y-2 rounded-lg border p-4">
            <ToggleSwitch
              label="Email notifications"
              checked
              onChange={() => {}}
            />
            <p className="text-[11px] text-neutral-500">
              Props: label set; checked true; onChange placeholder.
            </p>
          </div>

          {/* Off */}
          <div className="space-y-2 rounded-lg border p-4">
            <ToggleSwitch
              label="Email notifications"
              checked={false}
              onChange={() => {}}
            />
            <p className="text-[11px] text-neutral-500">
              Props: same label; checked false; onChange placeholder.
            </p>
          </div>

          {/* No label prop */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-700">Dark mode</span>
              <ToggleSwitch
                checked
                onChange={() => {}}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: checked true; no label prop; text handled outside.
            </p>
          </div>
        </div>
      </section>

      {/* 2) CONTROLLED STATE */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Controlled state</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Notifications */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Email notifications</p>
                <p className="text-xs text-neutral-500">
                  Send an email when a new testimonial is submitted.
                </p>
              </div>
              <ToggleSwitch
                checked={notificationsOn}
                onChange={() => setNotificationsOn((prev) => !prev)}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: checked bound to notificationsOn state; onChange toggles
              that state.
            </p>
          </div>

          {/* Auto publish */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Auto-publish testimonials</p>
                <p className="text-xs text-neutral-500">
                  New testimonials go live immediately without manual review.
                </p>
              </div>
              <ToggleSwitch
                checked={autoPublishOn}
                onChange={() => setAutoPublishOn((prev) => !prev)}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: checked bound to autoPublishOn state; onChange toggles that
              state.
            </p>
          </div>
        </div>
      </section>

      {/* 3) DISABLED / LOCKED */}
      <section className="space-y-3 pb-6">
        <h2 className="text-base font-semibold">Disabled / locked</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Disabled off */}
          <div className="space-y-2 rounded-lg border p-4">
            <ToggleSwitch
              label="Advanced analytics"
              checked={false}
              disabled
              onChange={() => {}}
            />
            <p className="text-[11px] text-neutral-500">
              Props: label set; checked false; disabled true.
            </p>
          </div>

          {/* Disabled on */}
          <div className="space-y-2 rounded-lg border p-4">
            <ToggleSwitch
              label="Legacy mode"
              checked
              disabled
              onChange={() => {}}
            />
            <p className="text-[11px] text-neutral-500">
              Props: label set; checked true; disabled true.
            </p>
          </div>

          {/* Disabled without label */}
          <div className="space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-neutral-700">Public widgets</span>
              <ToggleSwitch
                checked
                disabled
                onChange={() => {}}
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Props: checked true; disabled true; label handled by span.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
