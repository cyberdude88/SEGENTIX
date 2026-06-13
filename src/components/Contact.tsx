import Section from "./Section";

export default function Contact() {
  return (
    <Section id="contact" eyebrow="ESTABLISH LINK">
      <div className="border border-accent/30 bg-bg-soft/40 p-10 md:p-16 relative">
        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />

        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight text-shadow-glow">
              Need agent governance
              <br />
              <span className="text-accent">inside the enclave?</span>
            </h2>
            <p className="text-fg-dim mt-6 max-w-lg">
              Pilot deployments, design-partner conversations, and questions
              about the Agent RMF Overlay.
            </p>
          </div>

          <div className="md:col-span-5 space-y-4 mono text-sm">
            <a
              href="mailto:hello@aspm.dev"
              className="block border border-accent/40 p-4 hover:border-accent hover:bg-accent/5 transition-colors"
            >
              <div className="text-xs text-fg-dim uppercase tracking-[0.2em] mb-1">
                ▸ Email
              </div>
              <div className="text-accent">hello@aspm.dev</div>
            </a>
            <a
              href="mailto:hello@aspm.dev?subject=ASPM%20pilot"
              target="_blank"
              rel="noreferrer"
              className="block border border-accent/40 p-4 hover:border-accent hover:bg-accent/5 transition-colors"
            >
              <div className="text-xs text-fg-dim uppercase tracking-[0.2em] mb-1">
                ▸ Pilot
              </div>
              <div className="text-accent">Request design-partner access</div>
            </a>
            <a
              href="mailto:hello@aspm.dev?subject=Agent%20RMF%20Overlay"
              target="_blank"
              rel="noreferrer"
              className="block border border-accent/40 p-4 hover:border-accent hover:bg-accent/5 transition-colors"
            >
              <div className="text-xs text-fg-dim uppercase tracking-[0.2em] mb-1">
                ▸ Overlay
              </div>
              <div className="text-accent">Agent RMF mapping corpus</div>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-accent/10 mono text-[10px] text-fg-dim uppercase tracking-[0.3em] flex flex-wrap justify-between gap-4">
          <span>AIR-GAP READY</span>
          <span>RMF-NATIVE</span>
          <span className="text-accent">// PILOT CHANNEL OPEN</span>
        </div>
      </div>
    </Section>
  );
}
