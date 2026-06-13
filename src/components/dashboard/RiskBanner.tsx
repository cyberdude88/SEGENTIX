import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

const config: Record<
  RiskLevel,
  { tone: string; label: string; icon: typeof ShieldAlert }
> = {
  High: {
    tone: "border-danger/30 bg-danger-soft text-danger",
    label: "HIGH",
    icon: ShieldAlert,
  },
  Medium: {
    tone: "border-warn/30 bg-warn-soft text-warn",
    label: "MEDIUM",
    icon: ShieldQuestion,
  },
  Low: {
    tone: "border-accent/30 bg-accent-soft text-accent",
    label: "LOW",
    icon: ShieldCheck,
  },
};

export default function RiskBanner({
  level,
  shadowCount,
}: {
  level: RiskLevel;
  shadowCount: number;
}) {
  const c = config[level];
  const Icon = c.icon;
  return (
    <div
      className={cn(
        "border px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 backdrop-blur-sm",
        c.tone,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="h-9 w-9 grid place-items-center border border-current/20 bg-black/20">
          <Icon size={18} />
        </span>
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.24em] opacity-80">
            Overall posture
          </div>
          <div className="text-lg font-semibold tracking-tight leading-tight">
            {c.label} risk
          </div>
        </div>
      </div>

      <div className="hidden md:block w-px h-10 bg-current opacity-20" />

      <div className="text-[13px] leading-snug flex-1">
        <span className="text-fg">
          {shadowCount} unregistered agents detected
        </span>
        <span className="opacity-70"> — shadow AI exposure active.</span>
        <div className="text-fg-muted text-xs mt-0.5">
          Posture layer running. Runtime gateway and behavioral analytics
          required for full coverage of LLM01/05/07 + ASI01/05/07.
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="mono px-2 h-7 inline-flex items-center border border-current/20 bg-black/20 text-[10px] uppercase tracking-[0.18em]">
          Risk score 78 / 100
        </span>
      </div>
    </div>
  );
}
