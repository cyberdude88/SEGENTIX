"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import Section from "./Section";
import SignalParallax, { type SignalLabel } from "./SignalParallax";

type IconName =
  | "fde"
  | "consulting"
  | "ai-security"
  | "leadership"
  | "offensive"
  | "training"
  | "coaching";

function Icon({ name }: { name: IconName }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "fde":
      return (
        <svg {...common}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case "consulting":
      return (
        <svg {...common}>
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <rect x="4" y="6" width="16" height="16" rx="2" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="8" y1="16" x2="14" y2="16" />
        </svg>
      );
    case "ai-security":
      return (
        <svg {...common}>
          <path d="M12 2l9 4v6c0 6-4 10-9 10S3 18 3 12V6l9-4z" />
          <path d="M10 12l2 2 4-5" />
        </svg>
      );
    case "leadership":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <polygon points="16 8 12.5 13 9 13 12 16 13.5 11 17 8" />
        </svg>
      );
    case "offensive":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="1" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="1" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="23" y2="12" />
        </svg>
      );
    case "training":
      return (
        <svg {...common}>
          <path d="M2 9l10-5 10 5-10 5-10-5z" />
          <path d="M6 11v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
        </svg>
      );
    case "coaching":
      return (
        <svg {...common}>
          <path d="M21 11c0 4-4 7-9 7-1.5 0-3-.3-4-.7L3 19l1.7-4.3C3.6 13.5 3 12.3 3 11c0-4 4-7 9-7s9 3 9 7z" />
        </svg>
      );
  }
}

type Service = {
  tag: string;
  shortLabel: string;
  iconName: IconName;
  cloudPosition: [number, number, number];
  title: string;
  signal: string;
  outcome: string;
  body: string;
  stack: string[];
};

/*
 * Label constellation — all positions kept in the lower 60% of the camera's
 * view (camera at z=7, fov 54°) so the title block at the top of the section
 * never collides with a label. Mid-z values give a sense of 3D depth without
 * pulling anyone off-axis.
 *
 *   y world ≈ -3..+0.5    → screen lower-half / lower-third
 *   z world ≈ -2..+0.6    → near/far depth variance
 */
const services: Service[] = [
  {
    tag: "01 / DISCOVERY",
    shortLabel: "Discovery",
    iconName: "fde",
    cloudPosition: [-3.6, 0.2, -0.7],
    title: "Agent Discovery",
    signal: "Find the agents security teams cannot currently enumerate.",
    outcome: "Single inventory for cross-platform compatible agents across hosted, workflow, open-source, and protocol-integrated environments.",
    body:
      "SEGENTIX discovers agents across supported platforms and normalizes name, identifier, owner, platform, creation date, last activity, and status into one operational view.",
    stack: ["Hosted agents", "Low-code agents", "Workflow agents", "Open-source agents", "Custom agents", "Protocol-integrated"],
  },
  {
    tag: "02 / TOOLS",
    shortLabel: "Tools",
    iconName: "consulting",
    cloudPosition: [-2.2, -1.15, 0.0],
    title: "Tool Discovery",
    signal: "Know every system each agent can reach.",
    outcome: "Agent-to-tool relationship maps across enterprise SaaS, cloud, collaboration, ticketing, and identity systems.",
    body:
      "For each connected tool, SEGENTIX captures tool name, authentication method, connected identity, and environment so teams can see where agent authority originates.",
    stack: ["Identity", "Ticketing", "Cloud", "Code", "Collaboration", "CRM", "Data"],
  },
  {
    tag: "03 / ACTIONS",
    shortLabel: "Actions",
    iconName: "ai-security",
    cloudPosition: [0.0, -1.7, 0.55],
    title: "Action Discovery",
    signal: "Translate tool access into concrete capabilities.",
    outcome: "Agent-to-tool-to-action inventory that shows what each agent can read, create, modify, delete, or administer.",
    body:
      "Available actions are expanded into plain-language capability paths such as read user, disable user, create VM, delete issue, or manage records.",
    stack: ["Read user", "Create user", "Disable user", "Create VM", "Delete issue", "Manage records"],
  },
  {
    tag: "04 / EXCESS",
    shortLabel: "Excess",
    iconName: "leadership",
    cloudPosition: [2.2, -1.15, 0.0],
    title: "Excessive Permission Analysis",
    signal: "Separate available authority from authority that is actually used.",
    outcome: "Unused privilege findings with least-privilege recommendations for each over-permissioned agent.",
    body:
      "SEGENTIX compares granted actions to observed usage. When an agent can delete tickets or manage users but only reads and creates tickets, the excess permissions become findings.",
    stack: ["Observed usage", "Unused actions", "Least privilege", "Remove access", "Finding history"],
  },
  {
    tag: "05 / RISK",
    shortLabel: "Risk",
    iconName: "offensive",
    cloudPosition: [3.6, 0.2, -0.7],
    title: "Risk Scoring",
    signal: "Prioritize the agents with the most dangerous action paths.",
    outcome: "Risk scores backed by production access, administrative permission, sensitive data, ownership, internet access, and excess privilege factors.",
    body:
      "Each agent receives a score and reason set so security teams can move quickly from a long inventory to the handful of agents that matter first.",
    stack: ["Admin rights", "Production access", "Unknown owner", "Sensitive data", "Internet access"],
  },
  {
    tag: "06 / DASHBOARD",
    shortLabel: "Dashboard",
    iconName: "training",
    cloudPosition: [-1.15, -2.45, -0.4],
    title: "Executive Dashboard",
    signal: "Make agent risk understandable without becoming another IAM platform.",
    outcome: "Summary metrics for total agents, active agents, high-risk agents, unknown owners, overprivileged agents, and production access.",
    body:
      "The dashboard gives CISOs, security leads, and governance teams a fast view of where the environment stands and what should be reduced next.",
    stack: ["Total agents", "High risk", "Unknown owners", "Overprivileged", "Overall risk"],
  },
  {
    tag: "07 / ROADMAP",
    shortLabel: "Roadmap",
    iconName: "coaching",
    cloudPosition: [1.15, -2.45, -0.4],
    title: "Shadow Agent Roadmap",
    signal: "Move from known agents to the AI assets nobody registered.",
    outcome: "Future expansion into rogue integrations, unauthorized protocol servers, AI risk registers, governance reports, and audit evidence packages.",
    body:
      "Phase 2 and beyond expands SEGENTIX into shadow discovery, broader AI agent risk analysis, and audit readiness for NIST AI RMF, NIST CSF, ISO 42001, and internal programs.",
    stack: ["Shadow agents", "Protocol inventory", "Credential exposure", "Trust chains", "AI audit readiness"],
  },
];

const iconNameToKind: Record<IconName, SignalLabel["kind"]> = {
  fde: "fde",
  consulting: "consulting",
  "ai-security": "ai-security",
  leadership: "leadership",
  offensive: "offensive",
  training: "training",
  coaching: "coaching",
};

const cloudLabels: SignalLabel[] = services.map((s) => ({
  shortLabel: s.shortLabel,
  icon: <Icon name={s.iconName} /> as ReactNode,
  position: s.cloudPosition,
  kind: iconNameToKind[s.iconName],
}));

export default function Services() {
  const trackRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cloudIndex, setCloudIndex] = useState<number | null>(null);
  const labelPortalRef = useRef<HTMLDivElement>(null);

  const activeService = services[activeIndex];
  const detailService = cloudIndex !== null ? services[cloudIndex] : null;

  const scrollToCard = (index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    activeIndexRef.current = index;
    setActiveIndex(index);
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;

    const updateCards = () => {
      frame = 0;
      const center = track.scrollLeft + track.clientWidth / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const distance = (cardCenter - center) / track.clientWidth;
        const clamped = Math.max(-1, Math.min(1, distance));
        const abs = Math.abs(clamped);

        card.style.setProperty("--scroll-x", `${clamped * 56}px`);
        card.style.setProperty("--scroll-rotate", `${clamped * -13}deg`);
        card.style.setProperty("--scroll-scale", `${1.04 - abs * 0.14}`);
        card.style.setProperty("--scroll-opacity", `${1 - abs * 0.35}`);

        if (Math.abs(cardCenter - center) < closestDistance) {
          closestDistance = Math.abs(cardCenter - center);
          closestIndex = index;
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateCards);
    };

    updateCards();

    track.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      track.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (cloudIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCloudIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cloudIndex]);

  const warpLockRef = useRef(false);
  const warpFrameRef = useRef(0);
  const warpTimerRef = useRef(0);

  const triggerWarp = useCallback(() => {
    if (warpLockRef.current) return;
    if (window.scrollY <= 4) return;
    if (cloudIndex !== null) return;
    warpLockRef.current = true;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.body.dataset.warpBack = "true";
    window.cancelAnimationFrame(warpFrameRef.current);
    window.clearTimeout(warpTimerRef.current);

    if (reduceMotion) {
      window.scrollTo(0, 0);
      delete document.body.dataset.warpBack;
      warpLockRef.current = false;
      return;
    }

    const startY = window.scrollY;
    const durationMs = 1200;
    const startTime = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      window.scrollTo(0, startY * (1 - ease(progress)));
      if (progress < 1) {
        warpFrameRef.current = window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        window.history.replaceState(null, "", window.location.pathname);
        warpTimerRef.current = window.setTimeout(() => {
          delete document.body.dataset.warpBack;
          warpLockRef.current = false;
        }, 180);
      }
    };
    warpFrameRef.current = window.requestAnimationFrame(step);
  }, [cloudIndex]);

  // Dramatic "warp back" — one scroll up from the top of the services
  // section flies the page back to y=0 with a brief warp overlay.
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let touchStartY = 0;

    const atTop = () => {
      const rect = shell.getBoundingClientRect();
      return rect.top >= -8 && rect.top <= 120;
    };

    const onWheel = (e: WheelEvent) => {
      if (warpLockRef.current) {
        e.preventDefault();
        return;
      }
      if (e.deltaY >= 0) return;
      if (!atTop()) return;
      e.preventDefault();
      triggerWarp();
    };

    const onKey = (e: KeyboardEvent) => {
      if (!atTop()) return;
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === "Home") {
        e.preventDefault();
        triggerWarp();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!atTop()) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (dy < -60) triggerWarp();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.cancelAnimationFrame(warpFrameRef.current);
      window.clearTimeout(warpTimerRef.current);
      delete document.body.dataset.warpBack;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [triggerWarp]);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--pointer-x", `${x * 18}px`);
    card.style.setProperty("--pointer-y", `${y * 18}px`);
    card.style.setProperty("--pointer-rotate-x", `${y * -8}deg`);
    card.style.setProperty("--pointer-rotate-y", `${x * 10}deg`);
  };

  const resetPointer = (event: PointerEvent<HTMLButtonElement>) => {
    const card = event.currentTarget;
    card.style.setProperty("--pointer-x", "0px");
    card.style.setProperty("--pointer-y", "0px");
    card.style.setProperty("--pointer-rotate-x", "0deg");
    card.style.setProperty("--pointer-rotate-y", "0deg");
  };

  return (
    <div
      ref={shellRef}
      className="services-shell relative overflow-hidden lg:min-h-[100vh]"
    >
      <SignalParallax
        labels={cloudLabels}
        selectedIndex={cloudIndex}
        onSelect={setCloudIndex}
        labelPortal={labelPortalRef}
      />

      {/* Label DOM portal — drei positions <Html> using canvas projection coords,
          so this just owns stacking context. The label world coords keep them
          in the lower 60% of the viewport, clear of the title block. */}
      <div
        ref={labelPortalRef}
        className="services-label-portal pointer-events-none absolute inset-0 z-20 hidden lg:block"
      />

      <Section
        id="services"
        eyebrow="PLATFORM"
        title="Inventory every agent, understand every permission, and reduce the AI attack surface."
        className="services-section lg:pointer-events-none lg:pb-44 lg:pt-28"
      >
        {/* Mobile / tablet — carousel of cards */}
        <div className="pointer-events-auto lg:hidden">
          <div className="relative -mx-8 overflow-hidden px-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />

            <div className="grid gap-8">
              <div
                ref={trackRef}
                className="services-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-8 pt-4 [perspective:1400px]"
                aria-label="Services carousel"
              >
                {services.map((s, index) => (
                  <button
                    key={s.tag}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    type="button"
                    aria-label={`Explore ${s.title}`}
                    aria-current={activeIndex === index}
                    data-active={activeIndex === index}
                    onClick={() => scrollToCard(index)}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={resetPointer}
                    className="service-card group relative min-h-[330px] w-[78vw] max-w-[390px] shrink-0 snap-center overflow-hidden border border-accent/20 bg-bg-soft/30 p-6 text-left text-fg backdrop-blur-sm transition-colors duration-300 hover:border-accent/70 sm:w-[52vw]"
                    style={
                      {
                        "--scroll-x": "0px",
                        "--scroll-rotate": "0deg",
                        "--scroll-scale": "1",
                        "--scroll-opacity": "1",
                        "--pointer-x": "0px",
                        "--pointer-y": "0px",
                        "--pointer-rotate-x": "0deg",
                        "--pointer-rotate-y": "0deg",
                      } as CSSProperties
                    }
                  >
                    <div className="service-card-glow" />
                    <div className="hud-corner tl" />
                    <div className="hud-corner br" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="mono mb-8 text-[10px] uppercase tracking-[0.3em] text-accent">
                        {s.tag}
                      </div>
                      <div className="service-card-index mono">{String(index + 1).padStart(2, "0")}</div>
                      <h3 className="mb-4 max-w-[12ch] text-3xl font-semibold leading-[0.95] md:text-4xl">
                        {s.title}
                      </h3>
                      <p className="mt-auto max-w-[24ch] text-base leading-snug text-fg">{s.signal}</p>
                      <div className="mono mt-6 text-[10px] uppercase tracking-[0.24em] text-accent/80">
                        Capability
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <aside
                key={activeService.tag}
                className="service-detail relative overflow-hidden border border-accent/25 bg-bg-soft/75 p-6 backdrop-blur-md"
                aria-live="polite"
              >
                <div className="hud-corner tr" />
                <div className="hud-corner bl" />
                <div className="mono mb-5 text-[10px] uppercase tracking-[0.3em] text-accent">
                  {activeService.tag}
                </div>
                <h3 className="mb-3 text-2xl font-semibold leading-tight">{activeService.outcome}</h3>
                <p className="mb-6 text-sm leading-relaxed text-fg-dim">{activeService.body}</p>
                <div className="flex flex-wrap gap-2">
                  {activeService.stack.map((t) => (
                    <span
                      key={t}
                      className="mono border border-accent/20 bg-accent/5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-fg-dim"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </aside>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                {services.map((s, index) => (
                  <button
                    key={s.tag}
                    type="button"
                    aria-label={`Show ${s.title}`}
                    aria-current={activeIndex === index}
                    onClick={() => scrollToCard(index)}
                    className="h-1.5 w-8 bg-fg-dim/25 transition-colors hover:bg-accent/70 aria-current:bg-accent"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous service"
                  onClick={() => scrollToCard((activeIndex - 1 + services.length) % services.length)}
                  className="grid h-10 w-10 place-items-center border border-accent/25 text-accent transition-colors hover:border-accent/70 hover:bg-accent/10"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next service"
                  onClick={() => scrollToCard((activeIndex + 1) % services.length)}
                  className="grid h-10 w-10 place-items-center border border-accent/25 text-accent transition-colors hover:border-accent/70 hover:bg-accent/10"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>

      </Section>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-20 hidden items-center justify-center gap-4 lg:flex">
        <div className="services-engage-hint pointer-events-auto">
          <span className="services-engage-dot" aria-hidden />
          <span className="mono text-xs uppercase tracking-[0.32em] text-fg-dim">
            {cloudIndex === null
              ? "Select a surface to engage"
              : "Traversal engaged · ESC to return"}
          </span>
        </div>
        <button
          type="button"
          onClick={triggerWarp}
          className="pointer-events-auto mono border border-accent/30 bg-bg-soft/70 px-4 py-2 text-xs uppercase tracking-[0.32em] text-accent backdrop-blur-sm transition-colors hover:border-accent/70 hover:bg-accent/10"
        >
          ↑ Warp home
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center lg:hidden">
        <button
          type="button"
          onClick={triggerWarp}
          className="pointer-events-auto mono border border-accent/30 bg-bg-soft/70 px-4 py-2 text-xs uppercase tracking-[0.32em] text-accent backdrop-blur-sm transition-colors hover:border-accent/70 hover:bg-accent/10"
        >
          ↑ Warp home
        </button>
      </div>

      {/* Desktop detail overlay */}
      {detailService && (
        <div className="cloud-detail-overlay pointer-events-none absolute inset-0 z-30 hidden items-center justify-center px-8 lg:flex">
          <aside
            key={detailService.tag}
            className="cloud-detail pointer-events-auto relative w-full max-w-[560px] overflow-hidden border border-accent/35 bg-bg-soft/90 p-7 backdrop-blur-xl"
            aria-live="polite"
          >
            <button
              type="button"
              onClick={() => setCloudIndex(null)}
              aria-label="Close detail"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center border border-accent/25 text-accent transition-colors hover:border-accent/70 hover:bg-accent/10"
            >
              ×
            </button>
            <div className="hud-corner tl" />
            <div className="hud-corner br" />
            <div className="mono mb-4 pr-12 text-[10px] uppercase tracking-[0.3em] text-accent">
              {detailService.tag}
            </div>
            <h3 className="mb-3 pr-12 text-2xl font-semibold leading-tight">{detailService.outcome}</h3>
            <p className="mb-6 text-sm leading-relaxed text-fg-dim">{detailService.body}</p>
            <div className="flex flex-wrap gap-2">
              {detailService.stack.map((t) => (
                <span
                  key={t}
                  className="mono border border-accent/20 bg-accent/5 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.16em] text-fg-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
