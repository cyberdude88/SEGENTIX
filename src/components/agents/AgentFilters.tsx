"use client";
import { Search, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterState {
  q: string;
  platform: string;
  risk: string;
  owner: string;
  lastActive: string;
  shadowOnly: boolean;
  activeOnly: boolean;
  adminOnly: boolean;
  prodCredsOnly: boolean;
}

export const defaultFilters: FilterState = {
  q: "",
  platform: "all",
  risk: "all",
  owner: "all",
  lastActive: "all",
  shadowOnly: false,
  activeOnly: false,
  adminOnly: false,
  prodCredsOnly: false,
};

export default function AgentFilters({
  value,
  onChange,
  platforms,
  owners,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  platforms: string[];
  owners: string[];
}) {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) =>
    onChange({ ...value, [k]: v });

  const dirty =
    value.q ||
    value.platform !== "all" ||
    value.risk !== "all" ||
    value.owner !== "all" ||
    value.lastActive !== "all" ||
    value.shadowOnly ||
    value.activeOnly ||
    value.adminOnly ||
    value.prodCredsOnly;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-accent/10 bg-bg/30 px-5 py-3">
      <div className="relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-subtle"
        />
        <Input
          placeholder="Search agents…"
          className="pl-7 w-60"
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
        />
      </div>

      <Select
        value={value.platform}
        onChange={(e) => set("platform", e.target.value)}
      >
        <option value="all">All platforms</option>
        {platforms.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </Select>

      <Select value={value.risk} onChange={(e) => set("risk", e.target.value)}>
        <option value="all">All risk</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </Select>

      <Select value={value.owner} onChange={(e) => set("owner", e.target.value)}>
        <option value="all">All owners</option>
        <option value="unknown">Unknown owner</option>
        {owners.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Select>

      <Select
        value={value.lastActive}
        onChange={(e) => set("lastActive", e.target.value)}
      >
        <option value="all">Any activity</option>
        <option value="24h">Active &lt; 24h</option>
        <option value="7d">Active &lt; 7d</option>
        <option value="dormant">Dormant &gt; 30d</option>
      </Select>

      <label className="flex h-8 cursor-pointer select-none items-center gap-2 border border-accent/25 bg-bg/40 px-2.5">
        <input
          type="checkbox"
          checked={value.shadowOnly}
          onChange={(e) => set("shadowOnly", e.target.checked)}
          className="accent-danger h-3 w-3"
        />
        <span className="text-[12px]">Show shadow agents only</span>
      </label>

      {dirty && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultFilters)}
        >
          <X size={12} />
          Reset
        </Button>
      )}
    </div>
  );
}
