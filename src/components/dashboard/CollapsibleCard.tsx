"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type CollapsibleCardProps = {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  action?: ReactNode;
};

export default function CollapsibleCard({
  title,
  meta,
  children,
  className,
  defaultOpen = true,
  action,
}: CollapsibleCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <Card className={className}>
      <div className="border-b border-accent/10 px-5 py-3.5 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="group -mx-1 flex min-w-0 flex-1 items-center justify-between gap-3 px-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="mono truncate text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
            {title}
          </span>
          <span className="flex shrink-0 items-center gap-3">
            {meta ? (
              <span className="text-[11px] text-fg-subtle">{meta}</span>
            ) : null}
            <ChevronDown
              size={15}
              aria-hidden="true"
              className={cn(
                "text-fg-subtle transition-transform group-hover:text-accent",
                open ? "rotate-180" : "rotate-0",
              )}
            />
          </span>
        </button>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div
        id={contentId}
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </Card>
  );
}
