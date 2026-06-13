"use client";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { timeAgo } from "@/lib/utils";
import { POLICIES } from "@/lib/mock-data";
import type { PolicyRule } from "@/lib/types";

export default function PolicyRuleList() {
  const [rules, setRules] = useState<PolicyRule[]>(POLICIES);
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | "Allow" | "Deny">("all");
  const [draft, setDraft] = useState({
    action: "",
    policyType: "Allow" as "Allow" | "Deny",
    scope: "All agents",
  });
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    return rules.filter((r) => {
      if (type !== "all" && r.policyType !== type) return false;
      if (q && !`${r.action} ${r.scope} ${r.modifiedBy}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [rules, q, type]);

  function addRule() {
    if (!draft.action.trim()) return;
    setRules((prev) => [
      {
        id: `p${(prev.length + 1).toString().padStart(2, "0")}`,
        action: draft.action.trim(),
        policyType: draft.policyType,
        scope: draft.scope.trim() || "All agents",
        lastModified: new Date().toISOString(),
        modifiedBy: "You",
      },
      ...prev,
    ]);
    setDraft({ action: "", policyType: "Allow", scope: "All agents" });
    setOpen(false);
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Policy rules</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="teal">
            {rules.filter((r) => r.policyType === "Allow").length} Allow
          </Badge>
          <Badge variant="high">
            {rules.filter((r) => r.policyType === "Deny").length} Deny
          </Badge>
        </div>
      </CardHeader>

      <div className="flex flex-wrap items-center gap-2 px-5 py-3 hairline-b bg-bg-surface/40">
        <div className="relative">
          <Search
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <Input
            placeholder="Search action, scope, owner…"
            className="pl-7 w-72"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
        >
          <option value="all">All types</option>
          <option value="Allow">Allow</option>
          <option value="Deny">Deny</option>
        </Select>

        <div className="ml-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="primary" size="sm">
                <Plus size={12} />
                New rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New policy rule</DialogTitle>
              </DialogHeader>
              <DialogBody className="space-y-3">
                <div>
                  <label className="text-[11px] text-fg-muted block mb-1">
                    Action
                  </label>
                  <Input
                    placeholder="e.g. ServiceNow.CreateTicket"
                    value={draft.action}
                    onChange={(e) =>
                      setDraft({ ...draft, action: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-fg-muted block mb-1">
                      Type
                    </label>
                    <Select
                      value={draft.policyType}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          policyType: e.target.value as "Allow" | "Deny",
                        })
                      }
                      className="w-full"
                    >
                      <option value="Allow">Allow</option>
                      <option value="Deny">Deny</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-fg-muted block mb-1">
                      Scope
                    </label>
                    <Input
                      value={draft.scope}
                      onChange={(e) =>
                        setDraft({ ...draft, scope: e.target.value })
                      }
                    />
                  </div>
                </div>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="primary" size="sm" onClick={addRule}>
                  Save rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR className="hover:bg-transparent">
              <TH>Action</TH>
              <TH>Type</TH>
              <TH>Scope</TH>
              <TH>Last modified</TH>
              <TH>Modified by</TH>
            </TR>
          </THead>
          <TBody>
            {filtered.map((r) => (
              <TR key={r.id}>
                <TD className="font-mono text-[12px]">{r.action}</TD>
                <TD>
                  <Badge variant={r.policyType === "Allow" ? "teal" : "high"} dot>
                    {r.policyType}
                  </Badge>
                </TD>
                <TD className="text-fg-muted">{r.scope}</TD>
                <TD className="text-fg-muted">{timeAgo(r.lastModified)}</TD>
                <TD className="text-fg-muted">{r.modifiedBy}</TD>
              </TR>
            ))}
            {filtered.length === 0 && (
              <TR className="hover:bg-transparent">
                <TD colSpan={5}>
                  <div className="py-10 text-center text-fg-muted text-[13px]">
                    No matching rules.
                  </div>
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>
    </Card>
  );
}
