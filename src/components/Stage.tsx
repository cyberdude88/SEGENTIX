"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

type Moment = {
  i: string;
  tag: string;
  title: string;
  sub: string;
  cta?: { href: string; label: string };
};

const moments: Moment[] = [
  {
    i: "00",
    tag: "SEGENTIX",
    title: "SEGENTIX",
    sub: "AI agent permission and risk analysis for teams that need to know what every agent can actually do.",
  },
  {
    i: "01",
    tag: "DISCOVERY",
    title: "Discover Every Agent",
    sub: "Inventory cross-platform compatible agents across your AI environment.",
  },
  {
    i: "02",
    tag: "TOOL MAP",
    title: "Map Every Tool",
    sub: "Connect each agent to enterprise apps, cloud services, identity systems, collaboration tools, and more.",
  },
  {
    i: "03",
    tag: "ACTIONS",
    title: "Understand Every Action",
    sub: "See whether an agent can read users, create tickets, disable accounts, delete issues, or launch infrastructure.",
  },
  {
    i: "04",
    tag: "LEAST PRIVILEGE",
    title: "Find Excess Privilege",
    sub: "Compare available permissions to observed usage and identify actions that should be removed.",
  },
  {
    i: "05",
    tag: "RISK",
    title: "Score Every Agent",
    sub: "Prioritize agents with admin rights, production access, unknown owners, sensitive data, and internet reach.",
  },
  {
    i: "06",
    tag: "DASHBOARD",
    title: "Brief The Business",
    sub: "Track total agents, active agents, high-risk agents, unknown owners, and excessive permission findings.",
  },
  {
    i: "07",
    tag: "OUTCOME",
    title: "Reduce Every Risk",
    sub: "Go from \"we have AI agents\" to knowing exactly what they can access, perform, and expose.",
  },
  {
    i: "08",
    tag: "ESTABLISH LINK",
    title: "Request Pilot Access",
    sub: "alex.ansbergs@gmail.com",
    cta: { href: "mailto:alex.ansbergs@gmail.com", label: "OPEN CHANNEL" },
  },
];

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function renderTitleChars(title: string) {
  return title.split("").map((c, i) => {
    if (c === " ")
      return (
        <span key={i} style={{ whiteSpace: "pre" }}>
          {" "}
        </span>
      );
    const z = Math.sin(i * 0.7) * 14;
    return (
      <span
        key={i}
        style={{ display: "inline-block", transform: `translateZ(${z}px)` }}
      >
        {c}
      </span>
    );
  });
}

export default function Stage() {
  const sectionRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const snapLockRef = useRef(false);
  const jumpFrameRef = useRef(0);
  const [isJumping, setIsJumping] = useState(false);

  const handleWhatIDoClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const target = document.getElementById("services");
    if (!target) return;

    window.cancelAnimationFrame(jumpFrameRef.current);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetY = window.scrollY + target.getBoundingClientRect().top - 24;

    if (reduceMotion) {
      window.scrollTo(0, targetY);
      window.history.replaceState(null, "", "#services");
      return;
    }

    const startY = window.scrollY;
    const distance = targetY - startY;
    const durationMs = 1150;
    const startTime = performance.now();
    const ease = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    setIsJumping(true);

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      window.scrollTo(0, startY + distance * ease(progress));

      if (progress < 1) {
        jumpFrameRef.current = window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, targetY);
        window.history.replaceState(null, "", "#services");
        window.setTimeout(() => setIsJumping(false), 160);
      }
    };

    jumpFrameRef.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    let raf = 0;
    let scrollRaf = 0;
    const n = moments.length;
    const snapDuration = 0.65;
    let releaseTimer = 0;

    const stageTop = () => window.scrollY + sec.getBoundingClientRect().top;
    const stageScrollable = () =>
      Math.max(0, sec.offsetHeight - window.innerHeight);
    const snapStep = () => stageScrollable() / (n - 1);
    const stageProgress = () => {
      const step = snapStep();
      if (step <= 0) return 0;
      return Math.min(n - 1, Math.max(0, (window.scrollY - stageTop()) / step));
    };
    const isStageActive = () => {
      const top = stageTop();
      const bottom = top + stageScrollable();
      return window.scrollY >= top - 2 && window.scrollY <= bottom + 2;
    };
    const releaseSnapLock = () => {
      window.clearTimeout(releaseTimer);
      snapLockRef.current = false;
    };
    const scrollToY = (target: number, duration = snapDuration) => {
      snapLockRef.current = true;
      window.clearTimeout(releaseTimer);
      window.cancelAnimationFrame(scrollRaf);

      const start = window.scrollY;
      const distance = target - start;
      const startTime = performance.now();
      const durationMs = duration * 1000;
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);

      const step = (now: number) => {
        const progress = Math.min(1, (now - startTime) / durationMs);
        window.scrollTo(0, start + distance * ease(progress));
        if (progress < 1) {
          scrollRaf = window.requestAnimationFrame(step);
        } else {
          window.scrollTo(0, target);
          releaseSnapLock();
        }
      };

      scrollRaf = window.requestAnimationFrame(step);
      releaseTimer = window.setTimeout(releaseSnapLock, durationMs + 200);
    };

    // Initialize index from current scroll position (handles reloads mid-page).
    indexRef.current = Math.round(stageProgress());

    const goTo = (idx: number, force = false) => {
      const clamped = Math.min(n - 1, Math.max(0, idx));
      const step = snapStep();
      if (step <= 0) return;
      const target = stageTop() + clamped * step;
      const alreadyThere = Math.abs(window.scrollY - target) < 2;
      if (!force && clamped === indexRef.current && alreadyThere) return;
      indexRef.current = clamped;
      scrollToY(target);
    };

    const goAfterStage = () => {
      indexRef.current = n - 1;
      scrollToY(stageTop() + sec.offsetHeight, 0.75);
    };

    const wheelDelta = (e: WheelEvent) => {
      const legacy = e as WheelEvent & {
        wheelDelta?: number;
        wheelDeltaY?: number;
        detail?: number;
      };
      return (
        e.deltaY ||
        (legacy.wheelDeltaY ? -legacy.wheelDeltaY : 0) ||
        (legacy.wheelDelta ? -legacy.wheelDelta : 0) ||
        legacy.detail ||
        0
      );
    };

    const onWheel = (e: WheelEvent) => {
      const deltaY = wheelDelta(e);
      if (!isStageActive() || deltaY === 0) return;
      e.preventDefault();
      if (snapLockRef.current) return;
      indexRef.current = Math.round(stageProgress());
      if (deltaY > 0 && indexRef.current >= n - 1) {
        goAfterStage();
      } else {
        goTo(indexRef.current + (deltaY > 0 ? 1 : -1), true);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (snapLockRef.current || !isStageActive()) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        indexRef.current = Math.round(stageProgress());
        if (isStageActive() && indexRef.current >= n - 1) goAfterStage();
        else goTo(indexRef.current + 1, true);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        indexRef.current = Math.round(stageProgress());
        goTo(indexRef.current - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(n - 1);
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isStageActive()) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!isStageActive()) return;
      if (snapLockRef.current) return;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      indexRef.current = Math.round(stageProgress());
      if (dy > 0 && indexRef.current >= n - 1) {
        goAfterStage();
      } else {
        goTo(indexRef.current + (dy > 0 ? 1 : -1), true);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    const tick = () => {
      const rect = sec.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled =
        total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      if (!snapLockRef.current) {
        indexRef.current = Math.round(scrolled * (n - 1));
      }

      // ---- Moments ----
      moments.forEach((_, idx) => {
        const el = sec.querySelector(
          `[data-moment="${idx}"]`,
        ) as HTMLElement | null;
        if (!el) return;

        // phase: -1 = just arriving, 0 = at center, +1 = just departed
        const phase = scrolled * (n - 1) - idx;
        const abs = Math.abs(phase);

        if (abs >= 1) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }

        const eased = smoothstep(1 - abs);
        const opacity = eased;
        let z: number;
        let scale: number;
        let blur: number;

        if (phase < 0) {
          // arriving from depth
          z = phase * 500; // -500 → 0
          scale = 0.85 + (1 + phase) * 0.15;
          blur = -phase * 12;
        } else {
          // receding past camera
          z = phase * 350; // 0 → +350
          scale = 1 + phase * 0.18;
          blur = phase * 10;
        }

        el.style.opacity = String(opacity);
        el.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        el.style.pointerEvents = opacity > 0.6 ? "auto" : "none";
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.cancelAnimationFrame(jumpFrameRef.current);
      window.clearTimeout(releaseTimer);
      window.cancelAnimationFrame(scrollRaf);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${moments.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          src="/hero-bg-yoyo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="video-tint" />
        <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
        <div className="grain" />
        <div className="scanline" />
        <div className="stage-warp-overlay" data-active={isJumping} />

        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />

        {/* Persistent HUD labels — top */}
        <div className="absolute top-0 left-0 right-0 z-20 mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-start gap-4 p-6 pointer-events-none sm:grid-cols-[1fr_auto_1fr] md:p-10">
          <div className="mono min-w-0 text-[10px] text-accent uppercase tracking-[0.24em] sm:text-xs sm:tracking-[0.3em]">
            <div>{"SEGENTIX // v2"}</div>
            <div className="text-fg-dim mt-1">DISCOVER · MAP · REDUCE</div>
          </div>
          <div className="pointer-events-auto flex items-center gap-2 sm:justify-self-center">
            <button
              type="button"
              onClick={handleWhatIDoClick}
              data-active={isJumping}
              className="what-i-do-jump mono border border-accent/45 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-accent transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-xs"
            >
              PLATFORM
            </button>
            <a
              href="/demo"
              className="mono border border-accent/45 bg-transparent px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-accent transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:text-xs"
            >
              Open the demo
            </a>
          </div>
          <div className="mono hidden text-xs text-fg-dim text-right sm:block">
            <div>STATUS</div>
            <div className="mt-1 text-accent">{"// PERMISSION AWARE"}</div>
          </div>
        </div>

        {/* Stage: floating moments */}
        <div className="absolute inset-0 stage-3d">
          {moments.map((m, idx) => (
            <div key={m.i} data-moment={idx} className="moment px-8 text-center">
              <div className="mono text-[10px] md:text-xs text-accent uppercase tracking-[0.4em] mb-4 text-center">
                [ {m.i} / {m.tag} ]
              </div>
              <h2
                className="text-glow text-center text-[clamp(2rem,7vw,6rem)] font-extrabold leading-[0.95] tracking-tight mb-6 mx-auto"
                style={{ transformStyle: "preserve-3d" }}
              >
                {renderTitleChars(m.title)}
              </h2>
              <p className="moment-sub text-center text-lg md:text-2xl font-medium max-w-2xl mx-auto">
                {m.sub}
              </p>
              {m.cta && (
                <div className="text-center">
                  <a
                    href={m.cta.href}
                    className="mono text-xs text-accent uppercase tracking-[0.3em] inline-block mt-10 border border-accent/50 px-6 py-3 hover:bg-accent/10 transition-colors"
                  >
                    ▸ {m.cta.label}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Persistent HUD labels — bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 mx-auto flex max-w-7xl items-end justify-end p-6 md:p-10 pointer-events-none">
          <div className="mono text-xs text-fg-dim flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
            SCROLL TO TRAVERSE
          </div>
        </div>
      </div>
    </section>
  );
}
