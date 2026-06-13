"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

export default function Section({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.classList.add("is-visible");
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      className={clsx(
        "relative mx-auto max-w-7xl px-8 py-32",
        "opacity-0 translate-y-8 transition-all duration-1000 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0",
        className
      )}
    >
      {eyebrow && (
        <div className="mono text-xs text-accent uppercase tracking-[0.3em] mb-3">
          [ {eyebrow} ]
        </div>
      )}
      {title && (
        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-12 max-w-3xl">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}
