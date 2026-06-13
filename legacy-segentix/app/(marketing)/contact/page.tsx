import { Mail, Calendar, Github, Lock, type LucideIcon } from "lucide-react";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata = {
  title: "Contact — SEGENTIX",
  description:
    "Get in touch about pilot deployments, the open RMF overlay, or design-partner conversations.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 py-20">
      <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
        Contact
      </div>
      <h1 className="mt-2 text-[36px] sm:text-[44px] tracking-tight font-semibold leading-[1.1] max-w-[760px]">
        Talk to us before your next ATO cycle.
      </h1>
      <p className="mt-5 text-[15px] text-fg-muted leading-relaxed max-w-[680px]">
        Pilot deployments, design-partner conversations, and questions about
        the public RMF overlay. Responses within two business days.
      </p>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="hairline rounded-xl bg-bg-surface/40 p-6 sm:p-8">
          <h2 className="text-[16px] font-semibold tracking-tight">
            Send a message
          </h2>
          <p className="mt-1 text-[13px] text-fg-muted">
            For classified or sensitive topics, prefer the encrypted channels
            on the right.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <div className="space-y-3">
          <ContactCard
            icon={Mail}
            label="Email"
            value="hello@segentix.dev"
            href="mailto:hello@segentix.dev"
            sub="General and design partners"
          />
          <ContactCard
            icon={Calendar}
            label="Book a call"
            value="30 min intro"
            href="#"
            sub="ISSM / program-office briefings"
          />
          <ContactCard
            icon={Lock}
            label="Encrypted"
            value="Signal · PGP on request"
            href="mailto:hello@segentix.dev?subject=PGP%20request"
            sub="Classified-adjacent topics"
          />
          <ContactCard
            icon={Github}
            label="Open overlay"
            value="OWASP ↔ 800-53 / CNSSI / CMMC"
            href="#"
            sub="Public mapping corpus"
          />

          <div className="hairline rounded-lg p-4 bg-bg-surface/40 text-[12px] text-fg-subtle leading-relaxed">
            SEGENTIX is a pre-seed prototype. No data submitted via this site is
            stored on a third-party SaaS — the form posts to a local handler
            for the demo. Production pilots are on-prem by default.
          </div>
        </div>
      </div>

      <div className="mt-16 hairline-t pt-8 text-[12px] text-fg-muted">
        Pilot deployments are scoped for regulated environments where local
        evidence handling is mandatory.
      </div>
    </div>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  sub,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block hairline rounded-lg p-4 bg-bg-surface/40 hover:bg-bg-surface/70 transition"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-md bg-accent-soft text-accent grid place-items-center shrink-0">
          <Icon size={15} />
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
            {label}
          </div>
          <div className="mt-0.5 text-[14px] font-medium truncate">{value}</div>
          <div className="mt-0.5 text-[12px] text-fg-muted">{sub}</div>
        </div>
      </div>
    </a>
  );
}
