import * as React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "default"
  | "high"
  | "medium"
  | "low"
  | "info"
  | "warn"
  | "shadow"
  | "teal"
  | "neutral";

const styles: Record<Variant, string> = {
  default:
    "bg-surface-2 text-fg border-line",
  high: "bg-danger-soft text-danger border-danger/30",
  medium: "bg-warn-soft text-warn border-warn/30",
  low: "bg-accent-soft text-accent border-accent/30",
  info: "bg-info-soft text-info border-info/30",
  warn: "bg-warn-soft text-warn border-warn/30",
  shadow: "bg-danger-soft text-danger border-danger/30",
  teal: "bg-accent-soft text-accent border-accent/30",
  neutral: "bg-surface-2 text-fg-muted border-line",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
}

export function Badge({
  variant = "default",
  dot,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        styles[variant],
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "high" && "bg-danger",
            variant === "medium" && "bg-warn",
            variant === "low" && "bg-accent",
            variant === "info" && "bg-info",
            variant === "warn" && "bg-warn",
            variant === "shadow" && "bg-danger",
            variant === "teal" && "bg-accent",
            (variant === "default" || variant === "neutral") &&
              "bg-fg-muted/60",
          )}
        />
      )}
      {children}
    </span>
  );
}
