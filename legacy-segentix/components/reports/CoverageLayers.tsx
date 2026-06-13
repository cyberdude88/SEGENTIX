import { Check, Workflow, Activity, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const layers = [
  {
    n: 1,
    name: "Posture",
    status: "Active",
    icon: ShieldCheck,
    tone: "accent" as const,
    description:
      "Discovery, inventory, privilege mapping, policy enforcement.",
    coverage: ["LLM06", "LLM03", "ASI02", "ASI03", "ASI04", "ASI10"],
  },
  {
    n: 2,
    name: "Runtime gateway",
    status: "Roadmap",
    icon: Workflow,
    tone: "warn" as const,
    description:
      "MCP traffic inspection, prompt injection detection, inter-agent comms monitoring, action blocking.",
    coverage: ["LLM01", "LLM05", "LLM07", "ASI01", "ASI02", "ASI05", "ASI07"],
  },
  {
    n: 3,
    name: "Behavioral analytics",
    status: "Roadmap",
    icon: Activity,
    tone: "info" as const,
    description:
      "Drift detection, anomaly scoring, cascade risk modeling, memory poisoning indicators.",
    coverage: ["LLM02", "LLM04", "LLM10", "ASI06", "ASI08", "ASI09"],
  },
];

export default function CoverageLayers() {
  return (
    <ul className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {layers.map((l) => {
        const Icon = l.icon;
        const active = l.status === "Active";
        return (
          <li
            key={l.n}
            className={cn(
              "rounded-xl bg-bg-card border [border-width:0.5px] border-line p-4 flex flex-col gap-3",
              active && "border-accent/30",
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-7 w-7 rounded-md grid place-items-center",
                    active ? "bg-accent-soft text-accent" : "bg-surface-2 text-fg-muted",
                  )}
                >
                  <Icon size={14} />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
                    Layer {l.n}
                  </div>
                  <div className="text-[13px] font-medium">{l.name}</div>
                </div>
              </div>
              {active ? (
                <Badge variant="teal" dot>
                  <Check size={10} />
                  Active
                </Badge>
              ) : (
                <Badge variant={l.tone === "warn" ? "warn" : "info"}>
                  Roadmap
                </Badge>
              )}
            </div>
            <p className="text-[12px] text-fg-muted leading-snug">
              {l.description}
            </p>
            <div className="mt-auto">
              <div className="text-[10px] uppercase tracking-wider text-fg-subtle mb-1.5">
                Covers
              </div>
              <ul className="flex flex-wrap gap-1">
                {l.coverage.map((c) => (
                  <li
                    key={c}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-2 text-fg-muted border [border-width:0.5px] border-line"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
