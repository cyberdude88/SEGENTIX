"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { animate, stagger, onScroll } from "animejs";
import SplitText from "./SplitText";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = sectionRef.current!;

    animate(".hero-sub", {
      y: [40, 0],
      opacity: [0, 1],
      delay: 600,
      duration: 900,
      ease: "out(3)",
    });

    // All three headlines now reveal on scroll progress through the hero.
    // A flies in (0–30%), out (30–55%), B in (30–55%), out (55–80%), C in (55–80%).

    animate(".headline-a .char", {
      y: ["110%", "0%"],
      opacity: [0, 1],
      rotateX: [-90, 0],
      delay: stagger(15),
      autoplay: onScroll({
        target: sec,
        enter: "top bottom",
        leave: "+=30% bottom",
        sync: 0.5,
      }),
    });

    animate(".headline-a .char", {
      y: ["0%", "-160%"],
      opacity: [1, 0],
      rotateX: [0, 90],
      delay: stagger(8),
      autoplay: onScroll({
        target: sec,
        enter: "+=30% bottom",
        leave: "+=55% bottom",
        sync: 0.5,
      }),
    });

    animate(".headline-b .char", {
      y: ["160%", "0%"],
      opacity: [0, 1],
      rotateX: [-90, 0],
      delay: stagger(10),
      autoplay: onScroll({
        target: sec,
        enter: "+=30% bottom",
        leave: "+=55% bottom",
        sync: 0.5,
      }),
    });

    animate(".headline-b .char", {
      y: ["0%", "-160%"],
      opacity: [1, 0],
      rotateX: [0, 90],
      delay: stagger(8),
      autoplay: onScroll({
        target: sec,
        enter: "+=55% bottom",
        leave: "+=80% bottom",
        sync: 0.5,
      }),
    });

    animate(".headline-c .char", {
      y: ["160%", "0%"],
      opacity: [0, 1],
      rotateX: [-90, 0],
      delay: stagger(10),
      autoplay: onScroll({
        target: sec,
        enter: "+=55% bottom",
        leave: "+=80% bottom",
        sync: 0.5,
      }),
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[200vh]">
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
        <div className="absolute inset-0">
          <Scene3D />
        </div>
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="grain" />
        <div className="scanline" />

        <div className="hud-corner tl" />
        <div className="hud-corner tr" />
        <div className="hud-corner bl" />
        <div className="hud-corner br" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between p-6 md:p-10 pointer-events-none">
          <div className="flex items-start justify-between">
            <div className="mono text-xs text-accent uppercase tracking-[0.3em]">
              <div>{"SEGENTIX // v0.1"}</div>
              <div className="text-fg-dim mt-1">DISCOVER · MAP · EVIDENCE</div>
            </div>
            <div className="mono text-xs text-fg-dim text-right">
              <div>STATUS</div>
              <div className="mt-1 text-accent">{"// ENCLAVE READY"}</div>
            </div>
          </div>

          <div
            className="relative h-[44vh] md:h-[40vh] [perspective:1400px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <h1 className="headline-a absolute inset-0 flex flex-wrap items-center content-center text-[clamp(2.5rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight text-3d-white">
              <SplitText text="Agent Governance." />
            </h1>
            <h1 className="headline-b absolute inset-0 flex flex-wrap items-center content-center text-[clamp(2.5rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight text-3d-white opacity-0">
              <SplitText text="ATO Automation." />
            </h1>
            <h1 className="headline-c absolute inset-0 flex flex-wrap items-center content-center text-[clamp(2.5rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight text-3d-white opacity-0">
              <SplitText text="One control plane." />
            </h1>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="hero-sub max-w-xl text-fg-dim text-lg leading-relaxed opacity-0">
              Discover every agent. Map every action to a control. Generate the
              evidence. Walk into the audit ready.
            </p>
            <div className="mono text-xs text-fg-dim flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
              SCROLL TO DECRYPT
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
