import type {
  AccessScope,
  Agent,
  AgentTool,
  Approval,
  BusinessUnit,
  ComplianceControl,
  Discovery,
  Environment,
  ExecKpi,
  Origin,
  Platform,
  PolicyRule,
  PolicyTemplate,
  PolicyViolation,
  RiskClass,
  RiskLevel,
  ScopeAccess,
  SiemConnector,
  ToolName,
  UnapprovedCaller,
} from "./types";

const platforms: Platform[] = [
  "OpenAI Agents",
  "Microsoft Copilot Studio",
  "Salesforce Agentforce",
  "LangChain",
  "CrewAI",
  "n8n",
];

const owners = [
  "Priya Shah",
  "Marcus Lee",
  "Elena Ortiz",
  "Jordan Whitley",
  "Daniel Park",
  "Naomi Reyes",
  "Yusuf Ahmed",
  "Sofia Bellini",
  "Wen Chen",
  "Hannah Carter",
  "Ravi Iyer",
  "Lukas Becker",
];

const environments: Environment[] = ["Production", "Staging", "Development"];
const businessUnits: BusinessUnit[] = [
  "HR",
  "Finance",
  "IT",
  "Marketing",
  "Sales",
];

const toolCatalog: Record<
  ToolName,
  { type: string; auth: string[]; actions: Array<{ name: string; risk: RiskClass }> }
> = {
  "Microsoft Graph": {
    type: "Identity / Collaboration",
    auth: ["OAuth 2.0", "Client credentials"],
    actions: [
      { name: "Read.User", risk: "Read" },
      { name: "Read.Mail", risk: "Read" },
      { name: "Send.Mail", risk: "Write" },
      { name: "Create.Calendar", risk: "Write" },
      { name: "Reset.Password", risk: "Admin" },
    ],
  },
  ServiceNow: {
    type: "ITSM",
    auth: ["Basic", "OAuth 2.0"],
    actions: [
      { name: "Read.Ticket", risk: "Read" },
      { name: "Create.Ticket", risk: "Write" },
      { name: "Update.Ticket", risk: "Modify" },
      { name: "Delete.Ticket", risk: "Delete" },
      { name: "Assign.Role", risk: "Admin" },
    ],
  },
  Jira: {
    type: "Issue tracking",
    auth: ["API token"],
    actions: [
      { name: "Read.Issue", risk: "Read" },
      { name: "Create.Issue", risk: "Write" },
      { name: "Transition.Issue", risk: "Modify" },
      { name: "Delete.Issue", risk: "Delete" },
    ],
  },
  AWS: {
    type: "Cloud infrastructure",
    auth: ["IAM Role", "Access key"],
    actions: [
      { name: "Read.S3Object", risk: "Read" },
      { name: "Put.S3Object", risk: "Write" },
      { name: "Delete.Bucket", risk: "Delete" },
      { name: "Modify.IAMPolicy", risk: "Admin" },
      { name: "Run.EC2", risk: "Execute" },
    ],
  },
  Azure: {
    type: "Cloud infrastructure",
    auth: ["Managed identity", "Service principal"],
    actions: [
      { name: "Read.Resource", risk: "Read" },
      { name: "Deploy.Resource", risk: "Execute" },
      { name: "Delete.VM", risk: "Delete" },
      { name: "Modify.NSG", risk: "Admin" },
    ],
  },
  GitHub: {
    type: "Source control",
    auth: ["PAT", "GitHub App"],
    actions: [
      { name: "Read.Repo", risk: "Read" },
      { name: "Write.Repo", risk: "Write" },
      { name: "Merge.PR", risk: "Execute" },
      { name: "Delete.Repo", risk: "Delete" },
      { name: "Admin.Org", risk: "Admin" },
    ],
  },
  Slack: {
    type: "Collaboration",
    auth: ["OAuth 2.0", "Bot token"],
    actions: [
      { name: "Read.Channel", risk: "Read" },
      { name: "Post.Message", risk: "Write" },
      { name: "Invite.User", risk: "Modify" },
      { name: "Archive.Channel", risk: "Delete" },
    ],
  },
  Salesforce: {
    type: "CRM",
    auth: ["OAuth 2.0", "Named credential"],
    actions: [
      { name: "Read.Lead", risk: "Read" },
      { name: "Update.Opportunity", risk: "Modify" },
      { name: "Delete.Account", risk: "Delete" },
      { name: "Mass.Email", risk: "Write" },
      { name: "Admin.Profile", risk: "Admin" },
    ],
  },
};

const toolNames = Object.keys(toolCatalog) as ToolName[];

const agentNamePrefixes = [
  "Atlas",
  "Echo",
  "Nimbus",
  "Sentinel",
  "Pulse",
  "Helix",
  "Cobalt",
  "Vector",
  "Orbit",
  "Beacon",
  "Cipher",
  "Forge",
  "Tide",
  "Lumen",
  "Vesta",
  "Nova",
  "Sable",
  "Quill",
  "Halo",
  "Boreal",
];
const agentNameSuffixes = [
  "Ops",
  "Triage",
  "Concierge",
  "Sync",
  "Router",
  "Auditor",
  "Drafter",
  "Reviewer",
  "Closer",
  "Scout",
  "Sweep",
  "Coach",
  "Resolver",
  "Forecast",
  "Assist",
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seeded(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length) % arr.length];
}

function daysAgo(days: number): string {
  const d = new Date(2026, 5, 12, 9, 41, 0); // 2026-06-12
  d.setDate(d.getDate() - Math.floor(days));
  return d.toISOString();
}

function minutesAgo(min: number): string {
  const d = new Date(2026, 5, 12, 9, 41, 0);
  d.setMinutes(d.getMinutes() - Math.floor(min));
  return d.toISOString();
}

export const AGENTS: Agent[] = (() => {
  const out: Agent[] = [];
  for (let i = 0; i < 87; i++) {
    const rng = seeded(hash(`agent-${i}`));
    const prefix = pick(agentNamePrefixes, rng());
    const suffix = pick(agentNameSuffixes, rng());
    const name = `${prefix}-${suffix}-${String(i + 1).padStart(2, "0")}`;
    const platform = pick(platforms, rng());
    const env = pick(environments, rng());
    const bu = pick(businessUnits, rng());

    // 14 Shadow, 11 Discovered (registered after discovery), 62 Registered
    let origin: Origin = "Registered";
    if (i < 14) origin = "Shadow";
    else if (i < 25) origin = "Discovered";

    const ownerKnown = origin !== "Shadow" || rng() > 0.85;
    const owner = ownerKnown ? pick(owners, rng()) : null;

    const toolCount = 1 + Math.floor(rng() * 4);
    const used = new Set<ToolName>();
    const tools: AgentTool[] = [];
    while (tools.length < toolCount) {
      const t = pick(toolNames, rng());
      if (used.has(t)) continue;
      used.add(t);
      const meta = toolCatalog[t];
      const actionCount = 1 + Math.floor(rng() * meta.actions.length);
      const actions = [...meta.actions];
      for (let j = actions.length - 1; j > 0; j--) {
        const k = Math.floor(rng() * (j + 1));
        [actions[j], actions[k]] = [actions[k], actions[j]];
      }
      tools.push({
        name: t,
        type: meta.type,
        authMethod: pick(meta.auth, rng()),
        connectedAccount: `svc-${t.toLowerCase().replace(/\s+/g, "-")}-${(i % 9) + 1}`,
        actions: actions.slice(0, actionCount),
      });
    }

    const hasAdmin = tools.some((t) => t.actions.some((a) => a.risk === "Admin"));
    const hasDelete = tools.some((t) =>
      t.actions.some((a) => a.risk === "Delete"),
    );
    const hasProdCreds = env === "Production" && rng() > 0.55;

    let risk: RiskLevel = "Low";
    if (origin === "Shadow") risk = rng() > 0.3 ? "High" : "Medium";
    else if (hasAdmin && env === "Production") risk = "High";
    else if (hasAdmin || hasDelete || env === "Production") risk = "Medium";

    const active = rng() > 0.18;
    const created = daysAgo(30 + rng() * 400);
    const lastActive = active
      ? minutesAgo(rng() * 60 * 48)
      : daysAgo(7 + rng() * 60);

    const flags: string[] = [];
    if (!owner) flags.push("Unknown owner");
    if (hasAdmin) flags.push("Administrative permissions");
    if (origin === "Shadow") flags.push("Unregistered / shadow AI");
    if (hasProdCreds) flags.push("Production credentials");
    if (
      tools.some((t) =>
        ["AWS", "Azure", "Salesforce"].includes(t.name as string),
      ) &&
      env === "Production"
    )
      flags.push("Production access");
    if (!active) flags.push("Dormant >30 days");

    out.push({
      id: `agt_${(hash(name) % 0xfffff).toString(16).padStart(5, "0")}`,
      name,
      platform,
      owner,
      environment: env,
      businessUnit: bu,
      createdAt: created,
      lastActiveAt: lastActive,
      risk,
      origin,
      active,
      hasAdmin,
      hasProdCreds,
      tools,
      flags,
    });
  }
  return out;
})();

function setFlag(agent: Agent, flag: string, enabled: boolean) {
  if (enabled && !agent.flags.includes(flag)) agent.flags.push(flag);
  if (!enabled) agent.flags = agent.flags.filter((f) => f !== flag);
}

function reconcileCount(
  predicate: (agent: Agent) => boolean,
  target: number,
  apply: (agent: Agent, enabled: boolean) => void,
) {
  const ordered = [...AGENTS].sort((a, b) => a.id.localeCompare(b.id));
  const selected = new Set(
    ordered
      .filter(predicate)
      .slice(0, target)
      .map((a) => a.id),
  );

  for (const agent of ordered) {
    if (selected.size >= target) break;
    selected.add(agent.id);
  }

  for (const agent of AGENTS) {
    apply(agent, selected.has(agent.id));
  }
}

reconcileCount(
  (a) => a.active,
  74,
  (a, enabled) => {
    a.active = enabled;
    setFlag(a, "Dormant >30 days", !enabled);
  },
);

reconcileCount(
  (a) => a.risk === "High",
  27,
  (a, enabled) => {
    if (enabled) a.risk = "High";
    else if (a.risk === "High") a.risk = "Medium";
  },
);

reconcileCount(
  (a) => a.hasAdmin,
  64,
  (a, enabled) => {
    a.hasAdmin = enabled;
    setFlag(a, "Administrative permissions", enabled);
  },
);

reconcileCount(
  (a) => a.hasProdCreds,
  14,
  (a, enabled) => {
    a.hasProdCreds = enabled;
    setFlag(a, "Production credentials", enabled);
  },
);

export const METRICS = {
  total: AGENTS.length,
  active: AGENTS.filter((a) => a.active).length,
  unknownOwner: AGENTS.filter((a) => !a.owner).length,
  highRisk: AGENTS.filter((a) => a.risk === "High").length,
  adminAccess: AGENTS.filter((a) => a.hasAdmin).length,
  prodCreds: AGENTS.filter((a) => a.hasProdCreds).length,
  shadow: AGENTS.filter((a) => a.origin === "Shadow").length,
  shadowTrend: 3,
};

export const OVERALL_RISK: RiskLevel = "High";

export const RISK_BY_CATEGORY = [
  { category: "Excessive privileges", count: 22 },
  { category: "Unknown owner", count: METRICS.unknownOwner },
  { category: "Shadow AI", count: METRICS.shadow },
  { category: "Production access", count: 19 },
  { category: "Administrative", count: METRICS.adminAccess },
  { category: "Dormant", count: AGENTS.filter((a) => !a.active).length },
  { category: "Unapproved tools", count: 8 },
];

export const TOP_TOOLS = (() => {
  const counts = new Map<string, number>();
  for (const a of AGENTS) {
    for (const t of a.tools) {
      counts.set(t.name, (counts.get(t.name) || 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
})();

export const VIOLATIONS: PolicyViolation[] = [
  {
    id: "v1",
    agent: "Sentinel-Resolver-04",
    action: "AWS.DeleteBucket",
    policyType: "Deny",
    timestamp: minutesAgo(7),
  },
  {
    id: "v2",
    agent: "Pulse-Mass-Email-12",
    action: "Salesforce.MassEmail",
    policyType: "Warn",
    timestamp: minutesAgo(22),
  },
  {
    id: "v3",
    agent: "Nimbus-Drafter-29",
    action: "Microsoft Graph.ResetPassword",
    policyType: "Deny",
    timestamp: minutesAgo(48),
  },
  {
    id: "v4",
    agent: "Cipher-Auditor-17",
    action: "GitHub.AdminOrg",
    policyType: "Deny",
    timestamp: minutesAgo(96),
  },
  {
    id: "v5",
    agent: "Forge-Concierge-31",
    action: "ServiceNow.DeleteTicket",
    policyType: "Warn",
    timestamp: minutesAgo(140),
  },
  {
    id: "v6",
    agent: "Vector-Router-08",
    action: "Azure.DeleteVM",
    policyType: "Deny",
    timestamp: minutesAgo(220),
  },
  {
    id: "v7",
    agent: "Orbit-Triage-43",
    action: "Jira.DeleteIssue",
    policyType: "Warn",
    timestamp: minutesAgo(310),
  },
  {
    id: "v8",
    agent: "Halo-Closer-22",
    action: "Slack.ArchiveChannel",
    policyType: "Warn",
    timestamp: minutesAgo(485),
  },
];

export const POLICIES: PolicyRule[] = [
  { id: "p01", action: "ServiceNow.CreateTicket", policyType: "Allow", scope: "All agents", lastModified: daysAgo(3), modifiedBy: "Priya Shah" },
  { id: "p02", action: "Jira.CreateIssue", policyType: "Allow", scope: "Engineering BU", lastModified: daysAgo(8), modifiedBy: "Marcus Lee" },
  { id: "p03", action: "Azure.DeleteVM", policyType: "Deny", scope: "All agents", lastModified: daysAgo(1), modifiedBy: "Elena Ortiz" },
  { id: "p04", action: "AWS.DeleteBucket", policyType: "Deny", scope: "All agents", lastModified: daysAgo(1), modifiedBy: "Elena Ortiz" },
  { id: "p05", action: "GitHub.AdminOrg", policyType: "Deny", scope: "All agents", lastModified: daysAgo(5), modifiedBy: "Daniel Park" },
  { id: "p06", action: "Salesforce.DeleteAccount", policyType: "Deny", scope: "Production", lastModified: daysAgo(2), modifiedBy: "Naomi Reyes" },
  { id: "p07", action: "Microsoft Graph.ResetPassword", policyType: "Deny", scope: "All agents", lastModified: daysAgo(10), modifiedBy: "Yusuf Ahmed" },
  { id: "p08", action: "Slack.PostMessage", policyType: "Allow", scope: "All agents", lastModified: daysAgo(14), modifiedBy: "Sofia Bellini" },
  { id: "p09", action: "Slack.ArchiveChannel", policyType: "Deny", scope: "Marketing BU", lastModified: daysAgo(4), modifiedBy: "Sofia Bellini" },
  { id: "p10", action: "Microsoft Graph.SendMail", policyType: "Allow", scope: "Registered agents", lastModified: daysAgo(6), modifiedBy: "Wen Chen" },
  { id: "p11", action: "ServiceNow.DeleteTicket", policyType: "Deny", scope: "All agents", lastModified: daysAgo(11), modifiedBy: "Priya Shah" },
  { id: "p12", action: "AWS.RunEC2", policyType: "Allow", scope: "Dev environments", lastModified: daysAgo(9), modifiedBy: "Hannah Carter" },
  { id: "p13", action: "AWS.ModifyIAMPolicy", policyType: "Deny", scope: "All agents", lastModified: daysAgo(2), modifiedBy: "Daniel Park" },
  { id: "p14", action: "Azure.ModifyNSG", policyType: "Deny", scope: "Production", lastModified: daysAgo(13), modifiedBy: "Ravi Iyer" },
  { id: "p15", action: "Salesforce.MassEmail", policyType: "Deny", scope: "Shadow agents", lastModified: daysAgo(0), modifiedBy: "Naomi Reyes" },
  { id: "p16", action: "GitHub.DeleteRepo", policyType: "Deny", scope: "All agents", lastModified: daysAgo(15), modifiedBy: "Lukas Becker" },
  { id: "p17", action: "Jira.DeleteIssue", policyType: "Deny", scope: "All agents", lastModified: daysAgo(7), modifiedBy: "Marcus Lee" },
  { id: "p18", action: "Microsoft Graph.ReadMail", policyType: "Allow", scope: "HR BU", lastModified: daysAgo(18), modifiedBy: "Yusuf Ahmed" },
  { id: "p19", action: "ServiceNow.AssignRole", policyType: "Deny", scope: "All agents", lastModified: daysAgo(20), modifiedBy: "Elena Ortiz" },
  { id: "p20", action: "Salesforce.UpdateOpportunity", policyType: "Allow", scope: "Sales BU", lastModified: daysAgo(3), modifiedBy: "Jordan Whitley" },
  { id: "p21", action: "Slack.InviteUser", policyType: "Allow", scope: "IT BU", lastModified: daysAgo(12), modifiedBy: "Wen Chen" },
  { id: "p22", action: "Azure.DeployResource", policyType: "Allow", scope: "Engineering BU", lastModified: daysAgo(16), modifiedBy: "Ravi Iyer" },
];

export const DISCOVERIES: Discovery[] = [
  {
    id: "d1",
    name: "Sable-Concierge-91",
    platform: "Salesforce Agentforce",
    discoveredAt: minutesAgo(3),
    origin: "Shadow AI",
    source: "Salesforce admin API scan",
  },
  {
    id: "d2",
    name: "Tide-Forecast-07",
    platform: "n8n",
    discoveredAt: minutesAgo(11),
    origin: "Shadow AI",
    source: "Network egress fingerprint",
  },
  {
    id: "d3",
    name: "Quill-Drafter-44",
    platform: "Microsoft Copilot Studio",
    discoveredAt: minutesAgo(28),
    origin: "Business unit",
    source: "Entra app registration",
  },
  {
    id: "d4",
    name: "Lumen-Scout-19",
    platform: "LangChain",
    discoveredAt: minutesAgo(63),
    origin: "Shadow AI",
    source: "Endpoint AI runtime probe",
  },
  {
    id: "d5",
    name: "Beacon-Auditor-02",
    platform: "OpenAI Agents",
    discoveredAt: minutesAgo(110),
    origin: "IT-approved",
    source: "OpenAI org admin API",
  },
  {
    id: "d6",
    name: "Vesta-Triage-66",
    platform: "Salesforce Agentforce",
    discoveredAt: minutesAgo(174),
    origin: "Shadow AI",
    source: "Salesforce admin API scan",
  },
  {
    id: "d7",
    name: "Boreal-Sweep-12",
    platform: "CrewAI",
    discoveredAt: minutesAgo(260),
    origin: "Business unit",
    source: "Manual registration",
  },
  {
    id: "d8",
    name: "Nova-Resolver-33",
    platform: "n8n",
    discoveredAt: minutesAgo(420),
    origin: "IT-approved",
    source: "n8n workspace audit",
  },
];

export const SHADOW_BY_BU: Array<{ unit: BusinessUnit; shadow: number; registered: number }> = (() => {
  const out: Record<BusinessUnit, { shadow: number; registered: number }> = {
    HR: { shadow: 0, registered: 0 },
    Finance: { shadow: 0, registered: 0 },
    IT: { shadow: 0, registered: 0 },
    Marketing: { shadow: 0, registered: 0 },
    Sales: { shadow: 0, registered: 0 },
  };
  for (const a of AGENTS) {
    if (a.origin === "Shadow") out[a.businessUnit].shadow++;
    else out[a.businessUnit].registered++;
  }
  return businessUnits.map((unit) => ({
    unit,
    shadow: out[unit].shadow,
    registered: out[unit].registered,
  }));
})();

export const SHADOW_TOP_PLATFORMS = [
  { platform: "Salesforce Agentforce" as Platform, count: 6 },
  { platform: "n8n" as Platform, count: 4 },
  { platform: "LangChain" as Platform, count: 4 },
];

export const HIGH_RISK_AGENTS = AGENTS.filter((a) => a.risk === "High");

// ---- Permission graph: scopes × access level -----------------------------

const TOOL_SCOPE: Partial<Record<ToolName, AccessScope>> = {
  "Microsoft Graph": "Email",
  GitHub: "Source code",
  AWS: "Cloud infra",
  Azure: "Cloud infra",
  Salesforce: "CRM data",
  ServiceNow: "ITSM",
  Jira: "ITSM",
  Slack: "Chat",
};

function classifyAccess(
  actions: AgentTool["actions"],
): "admin" | "execute" | "write" | "read" {
  if (actions.some((a) => a.risk === "Admin")) return "admin";
  if (actions.some((a) => a.risk === "Execute")) return "execute";
  if (actions.some((a) => ["Write", "Modify", "Delete"].includes(a.risk)))
    return "write";
  return "read";
}

export const SCOPE_ACCESS: ScopeAccess[] = (() => {
  const scopes: AccessScope[] = [
    "Email",
    "Source code",
    "Cloud infra",
    "Identity",
    "CRM data",
    "ITSM",
    "Chat",
    "Payroll / HR",
  ];
  const buckets = new Map<AccessScope, ScopeAccess>();
  for (const s of scopes)
    buckets.set(s, { scope: s, read: 0, write: 0, execute: 0, user: 0, admin: 0 });
  for (const a of AGENTS) {
    const seen = new Set<string>();
    for (const t of a.tools) {
      const scope = TOOL_SCOPE[t.name];
      if (!scope) continue;
      const lvl = classifyAccess(t.actions);
      const key = `${scope}|${lvl}`;
      if (seen.has(key)) continue;
      seen.add(key);
      buckets.get(scope)![lvl]++;
      if (lvl !== "admin") {
        const userKey = `${scope}|user`;
        if (!seen.has(userKey)) {
          seen.add(userKey);
          buckets.get(scope)!.user++;
        }
      }
      if (
        t.name === "Microsoft Graph" &&
        t.actions.some((x) => x.name === "Reset.Password") &&
        !seen.has("Identity|admin")
      ) {
        seen.add("Identity|admin");
        buckets.get("Identity")!.admin++;
      }
    }
  }
  // Payroll / HR — none today (intentional zero row to show coverage gap)
  return scopes.map((s) => buckets.get(s)!);
})();

// ---- Approvals -----------------------------------------------------------

export const APPROVALS: Approval[] = [
  {
    id: "ap1",
    agent: "Cipher-Auditor-17",
    requestedBy: "Marcus Lee",
    approver: null,
    status: "Pending",
    requestedAt: minutesAgo(38),
    decidedAt: null,
    scope: "Source code",
    justification: "Quarterly repo policy audit — read-only org admin.",
  },
  {
    id: "ap2",
    agent: "Pulse-Mass-Email-12",
    requestedBy: "Naomi Reyes",
    approver: null,
    status: "Pending",
    requestedAt: minutesAgo(95),
    decidedAt: null,
    scope: "Email",
    justification: "Sales nurture campaign — 14d window.",
  },
  {
    id: "ap3",
    agent: "Sentinel-Resolver-04",
    requestedBy: "Elena Ortiz",
    approver: "Hannah Carter",
    status: "Approved",
    requestedAt: daysAgo(2),
    decidedAt: daysAgo(1),
    scope: "Cloud infra",
    justification: "S3 lifecycle cleanup — runbook RBK-204.",
  },
  {
    id: "ap4",
    agent: "Vector-Router-08",
    requestedBy: "Ravi Iyer",
    approver: "Daniel Park",
    status: "Rejected",
    requestedAt: daysAgo(3),
    decidedAt: daysAgo(2),
    scope: "Cloud infra",
    justification: "Bulk VM deletion — denied, insufficient justification.",
  },
  {
    id: "ap5",
    agent: "Halo-Closer-22",
    requestedBy: "Sofia Bellini",
    approver: "Wen Chen",
    status: "Approved",
    requestedAt: daysAgo(5),
    decidedAt: daysAgo(4),
    scope: "Chat",
    justification: "Channel archival for legacy projects.",
  },
  {
    id: "ap6",
    agent: "Nimbus-Drafter-29",
    requestedBy: "Yusuf Ahmed",
    approver: null,
    status: "Pending",
    requestedAt: minutesAgo(8),
    decidedAt: null,
    scope: "Identity",
    justification: "Helpdesk password resets — scoped to HR BU.",
  },
];

// ---- Compliance mapping --------------------------------------------------

export const COMPLIANCE_CONTROLS: ComplianceControl[] = [
  {
    framework: "NIST AI RMF",
    control: "GOVERN-1.2",
    title: "Roles & responsibilities defined for AI systems",
    state: "Partial",
    agentsInScope: 87,
    evidenceCount: 62,
    requirement:
      "Document accountable owners, reviewers, and operators for every AI system in production scope.",
    gapSummary:
      "25 agents have no named owner in the inventory; 11 owners map to inactive accounts in IdP.",
    recommendedActions: [
      "Assign owners to the 25 unowned agents in the inventory tab",
      "Re-attest ownership for the 11 stale IdP records",
      "Wire the quarterly ownership attestation automation in Jira",
    ],
    sampleEvidence: [
      "ownership-matrix-2026Q2.csv",
      "ai-rbac-policy-v3.pdf",
      "idp-attestation-export.json",
    ],
  },
  {
    framework: "NIST AI RMF",
    control: "MAP-2.3",
    title: "AI system inventory maintained",
    state: "Pass",
    agentsInScope: 87,
    evidenceCount: 87,
    requirement:
      "Maintain a continuously updated inventory of all AI systems, including purpose, data, and dependencies.",
    gapSummary: "All 87 agents discovered and tagged in the last 24h scan.",
    recommendedActions: [
      "Schedule monthly inventory snapshot exports for the audit room",
    ],
    sampleEvidence: [
      "agent-inventory-snapshot-2026-06-12.json",
      "discovery-scan-log-2026-06-11.csv",
    ],
  },
  {
    framework: "NIST AI RMF",
    control: "MEASURE-2.7",
    title: "Risk metrics tracked and reviewed",
    state: "Partial",
    agentsInScope: 73,
    evidenceCount: 48,
    requirement:
      "Define and review measurable risk indicators (drift, abuse, jailbreaks, hallucination) for each AI system.",
    gapSummary:
      "25 agents lack a baseline hallucination/abuse metric; review cadence undefined for 14 systems.",
    recommendedActions: [
      "Backfill baselines using the last 30d of red-team runs",
      "Add MEASURE-2.7 cadence to the policy builder",
    ],
    sampleEvidence: [
      "risk-metric-dashboard-export.pdf",
      "red-team-runs-2026Q2.csv",
    ],
  },
  {
    framework: "NIST AI RMF",
    control: "MANAGE-4.1",
    title: "Decommissioning & dormancy reviewed",
    state: "Gap",
    agentsInScope: 13,
    evidenceCount: 2,
    requirement:
      "Review dormant AI systems and decommission those no longer in use, including credential & data cleanup.",
    gapSummary:
      "11 dormant agents (>60d idle) still hold prod credentials. No decommissioning runbook attached.",
    recommendedActions: [
      "Run the dormant-agent sweep from the discovery tab",
      "Author and link a decommissioning runbook",
      "Rotate or revoke prod creds for the 11 dormant agents",
    ],
    sampleEvidence: ["dormant-agents-2026-06-10.csv"],
  },
  {
    framework: "ISO 42001",
    control: "A.6.2.4",
    title: "AI system change & approval log",
    state: "Partial",
    agentsInScope: 87,
    evidenceCount: 71,
    requirement:
      "Log all material changes to AI systems (model, prompt, tools, data) with named approver and timestamp.",
    gapSummary:
      "16 agents log changes without an approver field; prompt-only changes bypass the approval flow.",
    recommendedActions: [
      "Require approver on all change events in the policy builder",
      "Capture prompt edits via the runtime SDK hook",
    ],
    sampleEvidence: [
      "change-log-export-2026Q2.json",
      "approval-policy-A624.yaml",
    ],
  },
  {
    framework: "ISO 42001",
    control: "A.8.4",
    title: "Data quality for AI systems",
    state: "Pass",
    agentsInScope: 64,
    evidenceCount: 64,
    requirement:
      "Validate accuracy, completeness, and freshness of data feeding AI systems.",
    gapSummary: "All in-scope agents emit data-quality telemetry within SLO.",
    recommendedActions: ["Maintain current SLOs; review quarterly"],
    sampleEvidence: ["dq-telemetry-2026Q2.parquet", "dq-slo-policy.pdf"],
  },
  {
    framework: "ISO 42001",
    control: "A.9.3",
    title: "Third-party AI components inventoried",
    state: "Gap",
    agentsInScope: 14,
    evidenceCount: 3,
    requirement:
      "Maintain inventory of third-party models, APIs, and datasets, including license and DPA status.",
    gapSummary:
      "11 third-party model/API integrations missing license or DPA records.",
    recommendedActions: [
      "Run the third-party scan in the tools tab",
      "Attach DPA + license metadata for each unverified integration",
    ],
    sampleEvidence: [
      "third-party-inventory-draft.csv",
      "dpa-openai-signed.pdf",
    ],
  },
  {
    framework: "SOC 2",
    control: "CC6.1",
    title: "Logical access — least privilege",
    state: "Partial",
    agentsInScope: 64,
    evidenceCount: 42,
    requirement:
      "Restrict AI system access to minimum scopes required for function; review and revoke excess.",
    gapSummary:
      "22 agents hold scopes broader than their tool surface. 9 still hold admin-equivalent tokens.",
    recommendedActions: [
      "Apply the suggested scope-tightening diffs in the access tab",
      "Rotate the 9 admin-equivalent tokens",
    ],
    sampleEvidence: [
      "scope-diff-2026-06-09.json",
      "token-rotation-log.csv",
    ],
  },
  {
    framework: "SOC 2",
    control: "CC6.6",
    title: "Privileged access reviewed quarterly",
    state: "Pass",
    agentsInScope: 64,
    evidenceCount: 64,
    requirement:
      "Review and re-attest privileged AI access on at least a quarterly cadence.",
    gapSummary: "Q2 review complete; all reviewers signed off on time.",
    recommendedActions: ["Schedule Q3 reviewer assignments"],
    sampleEvidence: ["q2-priv-access-review-signed.pdf"],
  },
  {
    framework: "SOC 2",
    control: "CC7.2",
    title: "Anomalous activity detected and reviewed",
    state: "Partial",
    agentsInScope: 87,
    evidenceCount: 51,
    requirement:
      "Detect anomalous AI behavior and have a defined triage path for each detection.",
    gapSummary:
      "36 agents emit anomaly signals to SIEM without a documented triage owner.",
    recommendedActions: [
      "Route anomaly alerts through the violations feed",
      "Assign triage owner per agent tier",
    ],
    sampleEvidence: [
      "siem-anomaly-rules-export.json",
      "triage-runbook-cc72.md",
    ],
  },
  {
    framework: "OWASP LLM Top 10",
    control: "LLM02",
    title: "Insecure output handling",
    state: "Partial",
    agentsInScope: 22,
    evidenceCount: 14,
    requirement:
      "Sanitize and validate LLM outputs before they reach downstream systems, users, or executors.",
    gapSummary:
      "8 agents pass model output directly into shell/eval-equivalent tools without an allowlist.",
    recommendedActions: [
      "Wrap the 8 flagged tools with the output-allowlist policy",
      "Add regression tests using the LLM02 red-team pack",
    ],
    sampleEvidence: [
      "tool-allowlist-policy.yaml",
      "redteam-llm02-results.csv",
    ],
  },
  {
    framework: "OWASP LLM Top 10",
    control: "LLM06",
    title: "Excessive agency",
    state: "Gap",
    agentsInScope: 27,
    evidenceCount: 6,
    requirement:
      "Limit the autonomy, tool reach, and blast radius of AI agents to what their use-case requires.",
    gapSummary:
      "21 agents can invoke destructive tools without an approval step. 7 have unbounded loop budgets.",
    recommendedActions: [
      "Require approval for destructive tools in the policy builder",
      "Set max-step budgets per agent tier",
      "Move the 7 unbounded agents behind the approvals queue",
    ],
    sampleEvidence: [
      "destructive-tool-matrix.csv",
      "approvals-policy-llm06.yaml",
    ],
  },
  {
    framework: "OWASP LLM Top 10",
    control: "LLM08",
    title: "Vector & embedding weaknesses",
    state: "Pass",
    agentsInScope: 19,
    evidenceCount: 19,
    requirement:
      "Protect vector stores from poisoning, leakage, and unauthorized retrieval; segregate tenants.",
    gapSummary:
      "All vector stores in scope use per-tenant namespaces and signed-ingest pipelines.",
    recommendedActions: ["Re-run poisoning fuzzer monthly"],
    sampleEvidence: [
      "vector-tenant-policy.yaml",
      "ingest-signature-log.csv",
    ],
  },
];

// ---- SIEM / integrations -------------------------------------------------

function spark(seed: number, base: number): number[] {
  const out: number[] = [];
  let x = seed;
  for (let i = 0; i < 24; i++) {
    x = (x * 9301 + 49297) % 233280;
    const noise = (x / 233280 - 0.5) * 0.6;
    out.push(Math.max(0, Math.round(base * (1 + noise))));
  }
  return out;
}

export const SIEM_CONNECTORS: SiemConnector[] = [
  {
    name: "Splunk Cloud",
    category: "SIEM",
    status: "Connected",
    lastEvent: minutesAgo(1),
    eventsPer24h: 14820,
    detectionsActive: 142,
    alertsOpen: 11,
    ingestGb24h: 38.4,
    latencyMs: 740,
    sparkline: spark(11, 617),
    notes: "Agent telemetry forwarded via HEC token segentix-prod.",
  },
  {
    name: "Microsoft Sentinel",
    category: "SIEM",
    status: "Connected",
    lastEvent: minutesAgo(2),
    eventsPer24h: 9614,
    detectionsActive: 88,
    alertsOpen: 6,
    ingestGb24h: 21.7,
    latencyMs: 980,
    sparkline: spark(23, 400),
    notes: "Workspace segentix-law-eastus2 · DCR rules in sync.",
  },
  {
    name: "Google Chronicle",
    category: "SIEM",
    status: "Degraded",
    lastEvent: minutesAgo(46),
    eventsPer24h: 3120,
    detectionsActive: 34,
    alertsOpen: 4,
    ingestGb24h: 6.2,
    latencyMs: 4200,
    sparkline: spark(47, 130),
    notes: "Forwarder backlog 46m — check chronicle-fwd-us pod.",
  },
  {
    name: "Datadog",
    category: "Observability",
    status: "Connected",
    lastEvent: minutesAgo(3),
    eventsPer24h: 22104,
    detectionsActive: 61,
    alertsOpen: 3,
    ingestGb24h: 54.1,
    latencyMs: 320,
    sparkline: spark(7, 920),
    notes: "Logs + traces from agent runtimes; SLO dashboards live.",
  },
  {
    name: "ServiceNow ITSM",
    category: "Ticketing",
    status: "Connected",
    lastEvent: minutesAgo(11),
    eventsPer24h: 184,
    detectionsActive: 9,
    alertsOpen: 2,
    ingestGb24h: 0.1,
    latencyMs: 1500,
    sparkline: spark(101, 8),
    notes: "Violation → incident bridge active (SecOps assignment group).",
  },
  {
    name: "Okta",
    category: "Identity",
    status: "Not configured",
    lastEvent: null,
    eventsPer24h: 0,
    detectionsActive: 0,
    alertsOpen: 0,
    ingestGb24h: 0,
    latencyMs: 0,
    sparkline: new Array(24).fill(0),
    notes: "Add API token to ingest system log events for non-human accounts.",
  },
];

// ---- Policy templates (no-code builder preview) --------------------------

export const POLICY_TEMPLATES: PolicyTemplate[] = [
  {
    id: "pt1",
    when: "Agent attempts AWS.DeleteBucket",
    and: "Environment = Production",
    then: "Deny",
    category: "Cloud infra",
    enabled: true,
  },
  {
    id: "pt2",
    when: "Agent attempts Microsoft Graph.ResetPassword",
    and: "Agent origin = Shadow",
    then: "Deny",
    category: "Identity",
    enabled: true,
  },
  {
    id: "pt3",
    when: "Agent attempts Salesforce.MassEmail",
    and: "Recipients > 500",
    then: "Require approval",
    category: "CRM data",
    enabled: true,
  },
  {
    id: "pt4",
    when: "Agent attempts GitHub.AdminOrg",
    and: null,
    then: "Deny",
    category: "Source code",
    enabled: true,
  },
  {
    id: "pt5",
    when: "Agent attempts Slack.ArchiveChannel",
    and: "BU = Marketing",
    then: "Warn",
    category: "Chat",
    enabled: false,
  },
];

// ---- Unapproved callers (shadow API usage outside agent runtime) --------

export const UNAPPROVED_CALLERS: UnapprovedCaller[] = [
  {
    id: "uc1",
    identity: "j.chen@corp",
    identityType: "User token",
    surface: "Internal LLM gateway",
    endpoint: "POST /v1/chat/completions (model: gpt-4o)",
    sourceEnv: "Development",
    callCount24h: 1842,
    lastSeen: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    reason: "Caller is not a registered agent identity",
    enforcement: "Warned",
    suggestedAgent: "Register as agent: 'chen-research-loop'",
  },
  {
    id: "uc2",
    identity: "ci-runner-prod-07",
    identityType: "CI job",
    surface: "Embeddings API",
    endpoint: "POST /v1/embeddings",
    sourceEnv: "Production",
    callCount24h: 24317,
    lastSeen: new Date(Date.now() - 90 * 1000).toISOString(),
    reason: "Calls from prod CI lack agent registration; no policy bound",
    enforcement: "Observed",
    suggestedAgent: "Bind to agent: 'docs-index-pipeline'",
  },
  {
    id: "uc3",
    identity: "svc-billing-etl",
    identityType: "Service account",
    surface: "Tool API (MCP)",
    endpoint: "mcp://stripe.refund",
    sourceEnv: "Production",
    callCount24h: 12,
    lastSeen: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    reason: "Service account invoked high-risk tool outside agent runtime",
    enforcement: "Blocked",
    suggestedAgent: null,
  },
  {
    id: "uc4",
    identity: "unknown · 10.42.7.18",
    identityType: "Unknown",
    surface: "Internal LLM gateway",
    endpoint: "POST /v1/chat/completions (model: claude-opus-4-7)",
    sourceEnv: "Development",
    callCount24h: 217,
    lastSeen: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    reason: "No OIDC identity attached; gateway token issued via shared secret",
    enforcement: "Warned",
    suggestedAgent: null,
  },
  {
    id: "uc5",
    identity: "m.alvarez@corp",
    identityType: "User token",
    surface: "Vector DB API",
    endpoint: "POST /collections/customer-pii/query",
    sourceEnv: "Staging",
    callCount24h: 64,
    lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    reason: "Direct query to PII collection bypasses agent access controls",
    enforcement: "Blocked",
    suggestedAgent: null,
  },
  {
    id: "uc6",
    identity: "svc-mlops",
    identityType: "Service account",
    surface: "Fine-tune API",
    endpoint: "POST /v1/fine_tuning/jobs",
    sourceEnv: "Development",
    callCount24h: 3,
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    reason: "Fine-tune submitted without data-classification review",
    enforcement: "Warned",
    suggestedAgent: "Route via 'mlops-training-pipeline'",
  },
];

// ---- Executive KPIs ------------------------------------------------------

export const EXEC_KPIS: ExecKpi[] = [
  { label: "Overall risk score", value: "72", delta: -6, unit: "/100", good: "down" },
  { label: "Shadow agents", value: String(METRICS.shadow), delta: 3, good: "down" },
  { label: "Policy coverage", value: "78", delta: 11, unit: "%", good: "up" },
  { label: "Mean time to revoke", value: "14", delta: -22, unit: "min", good: "down" },
  { label: "Evidence freshness", value: "98", delta: 2, unit: "%", good: "up" },
  { label: "Auditor-ready controls", value: "9/13", delta: 2, good: "up" },
];
