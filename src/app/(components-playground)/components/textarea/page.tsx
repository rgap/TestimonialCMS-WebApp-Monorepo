"use client";

import "@/app/globals.css";
import { Textarea } from "@/components/ui";
import { notFound } from "next/navigation";

export default function TextareaPage() {
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
        <h1 className="text-3xl font-bold">Textarea</h1>
        <p className="max-w-xl text-sm text-neutral-500">
          Common Textarea combinations: label, helper text, error, disabled and
          read-only states.
        </p>
      </header>

      {/* SECTION: BASIC VARIATIONS */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Basic combinations</h2>
          <p className="text-xs text-neutral-500">
            Label + placeholder + optional helper or error.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Label + placeholder */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Client testimonial"
              placeholder="Explain what problem we helped you solve and what changed after using our product..."
            />
            <p className="text-[11px] text-neutral-500">
              Props: label set to field name, placeholder set to a guiding
              prompt, no helperText or error.
            </p>
          </div>

          {/* Label + helperText */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Reviewer notes"
              placeholder="Add internal context for your team..."
              helperText="Only your team can see this. It is never shown in public widgets."
            />
            <p className="text-[11px] text-neutral-500">
              Props: label and placeholder as above, helperText used for extra
              info under the field, error not set.
            </p>
          </div>

          {/* Label + error */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Short feedback"
              placeholder="Share a quick comment..."
              error="Please write at least a couple of sentences so the feedback is useful."
            />
            <p className="text-[11px] text-neutral-500">
              Props: label and placeholder set, error set to a specific
              validation message, helperText omitted.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: HELPERTEXT VS ERROR PRIORITY */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Helper text vs error</h2>
          <p className="text-xs text-neutral-500">
            Same field with helperText only vs error only.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Internal description"
              placeholder="Describe how this testimonial should be used..."
              helperText="Think about placement, audience and tone."
            />
            <p className="text-[11px] text-neutral-500">
              Props: helperText used to give a hint below the field, error not
              provided so normal state is shown.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Internal description"
              placeholder="Describe how this testimonial should be used..."
              error="Description is required for internal documentation."
            />
            <p className="text-[11px] text-neutral-500">
              Props: error used to show the message and error styling,
              helperText omitted so error takes full space.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: DISABLED / READ-ONLY */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Disabled and read-only</h2>
          <p className="text-xs text-neutral-500">
            Non-editable variations with existing content.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Read-only */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="System-generated summary"
              defaultValue="Summary generated automatically from the latest published testimonials."
              readOnly
            />
            <p className="text-[11px] text-neutral-500">
              Props: defaultValue set to a text block, readOnly = true so text
              is visible but not editable, no error/helper.
            </p>
          </div>

          {/* Disabled */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Published testimonial (locked)"
              defaultValue="This testimonial is locked because it is used in live embeds. Duplicate it to create a new version."
              disabled
            />
            <p className="text-[11px] text-neutral-500">
              Props: defaultValue set to existing content, disabled = true so
              the textarea is visually disabled and non-focusable.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION: RESIZE / LONG CONTENT EXAMPLES */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold">Long content examples</h2>
          <p className="text-xs text-neutral-500">
            Sample content to see how multi-line text behaves.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Empty with placeholder */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Long-form testimonial"
              placeholder="Paste or write a full testimonial here. You can include multiple paragraphs, quotes and detailed before / after stories."
            />
            <p className="text-[11px] text-neutral-500">
              Props: label and long placeholder used together, defaultValue not
              set, uses browser resize-y behavior.
            </p>
          </div>

          {/* Pre-filled */}
          <div className="space-y-2 rounded-lg border p-4">
            <Textarea
              label="Example testimonial (prefilled)"
              defaultValue={`Before using our product, managing client testimonials was scattered across emails and slides. Now everything lives in one place, and publishing new stories takes minutes instead of days.`}
            />
            <p className="text-[11px] text-neutral-500">
              Props: label set, defaultValue filled with multi-line style text,
              no placeholder, helperText or error.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
