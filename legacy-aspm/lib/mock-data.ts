import type {
  Agent,
  AgentTool,
  BusinessUnit,
  Discovery,
  Environment,
  Origin,
  Platform,
  PolicyRule,
  PolicyViolation,
  RiskClass,
  RiskLevel,
  ToolName,
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
      { name: "Run.EC2", risk: "Write" },
    ],
  },
  Azure: {
    type: "Cloud infrastructure",
    auth: ["Managed identity", "Service principal"],
    actions: [
      { name: "Read.Resource", risk: "Read" },
      { name: "Deploy.Resource", risk: "Write" },
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
      { name: "Merge.PR", risk: "Modify" },
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
      const actions = [...meta.actions]
        .sort(() => rng() - 0.5)
        .slice(0, actionCount);
      tools.push({
        name: t,
        type: meta.type,
        authMethod: pick(meta.auth, rng()),
        connectedAccount: `svc-${t.toLowerCase().replace(/\s+/g, "-")}-${(i % 9) + 1}`,
        actions,
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

export const HIGH_RISK_AGENTS = AGENTS.filter((a) => a.risk === "High").slice(
  0,
  5,
);
