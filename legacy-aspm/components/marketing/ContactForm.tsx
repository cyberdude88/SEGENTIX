"use client";
import { useState } from "react";
import { Send } from "lucide-react";

type State = "idle" | "submitting" | "ok";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setTimeout(() => setState("ok"), 600);
  }

  if (state === "ok") {
    return (
      <div className="hairline rounded-md bg-accent-soft text-fg p-4 text-[13px]">
        Thanks — we&apos;ll respond within two business days. For anything
        sensitive, reply to the email confirmation with PGP or move the
        conversation to Signal.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Name" name="name" placeholder="Jane Doe" required />
        <Field
          label="Work email"
          name="email"
          type="email"
          placeholder="jane@agency.gov"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field
          label="Organization"
          name="org"
          placeholder="Program office, contractor, agency…"
        />
        <Select
          label="I'm interested in"
          name="interest"
          options={[
            "Pilot deployment",
            "Design-partner conversation",
            "The public RMF overlay",
            "Press / analyst",
            "Other",
          ]}
        />
      </div>
      <TextArea
        label="Message"
        name="message"
        placeholder="What environment are you in (cloud / on-prem / air-gap), what audit framework drives the timeline, and what would success look like?"
        required
      />
      <div className="flex items-center justify-between pt-1">
        <p className="text-[11px] text-fg-subtle">
          No tracking. No third-party CRM in the loop.
        </p>
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-accent text-black text-[13px] font-medium hover:opacity-90 disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Send"}
          <Send size={13} />
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-fg-subtle mb-1">
        {label}
      </span>
      <input
        {...rest}
        className="w-full h-9 px-3 rounded-md bg-bg-base hairline text-[13px] outline-none focus:ring-2 focus:ring-accent-ring"
      />
    </label>
  );
}

function TextArea({
  label,
  ...rest
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-fg-subtle mb-1">
        {label}
      </span>
      <textarea
        {...rest}
        rows={5}
        className="w-full px-3 py-2 rounded-md bg-bg-base hairline text-[13px] outline-none focus:ring-2 focus:ring-accent-ring resize-y"
      />
    </label>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wider text-fg-subtle mb-1">
        {label}
      </span>
      <select
        name={name}
        defaultValue=""
        className="w-full h-9 px-2 rounded-md bg-bg-base hairline text-[13px] outline-none focus:ring-2 focus:ring-accent-ring"
      >
        <option value="" disabled>
          Choose one…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
