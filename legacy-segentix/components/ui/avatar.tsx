import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({
  name,
  size = 28,
  tone = "default",
  className,
}: {
  name: string;
  size?: number;
  tone?: "default" | "danger" | "warn" | "info" | "accent";
  className?: string;
}) {
  const palette: Record<string, string> = {
    default: "bg-surface-3 text-fg",
    danger: "bg-danger-soft text-danger",
    warn: "bg-warn-soft text-warn",
    info: "bg-info-soft text-info",
    accent: "bg-accent-soft text-accent",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium text-[10px] tracking-wide",
        palette[tone],
        className,
      )}
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </span>
  );
}
