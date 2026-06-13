export type Platform =
  | "OpenAI Agents"
  | "Microsoft Copilot Studio"
  | "Salesforce Agentforce"
  | "LangChain"
  | "CrewAI"
  | "n8n";

export type ToolName =
  | "Microsoft Graph"
  | "ServiceNow"
  | "Jira"
  | "AWS"
  | "Azure"
  | "GitHub"
  | "Slack"
  | "Salesforce";

export type RiskClass = "Read" | "Write" | "Execute" | "Modify" | "Delete" | "Admin";
export type RiskLevel = "High" | "Medium" | "Low";
export type Environment = "Production" | "Staging" | "Development";
export type Origin = "Registered" | "Discovered" | "Shadow";
export type OriginBadge = "IT-approved" | "Business unit" | "Shadow AI";
export type BusinessUnit = "HR" | "Finance" | "IT" | "Marketing" | "Sales";

export interface AgentTool {
  name: ToolName;
  type: string;
  authMethod: string;
  connectedAccount: string;
  actions: Array<{ name: string; risk: RiskClass }>;
}

export interface Agent {
  id: string;
  name: string;
  platform: Platform;
  owner: string | null;
  environment: Environment;
  businessUnit: BusinessUnit;
  createdAt: string;
  lastActiveAt: string;
  risk: RiskLevel;
  origin: Origin;
  active: boolean;
  hasAdmin: boolean;
  hasProdCreds: boolean;
  tools: AgentTool[];
  flags: string[];
}

export interface PolicyViolation {
  id: string;
  agent: string;
  action: string;
  policyType: "Deny" | "Warn";
  timestamp: string;
}

export interface PolicyRule {
  id: string;
  action: string;
  policyType: "Allow" | "Deny";
  scope: string;
  lastModified: string;
  modifiedBy: string;
}

export interface Discovery {
  id: string;
  name: string;
  platform: Platform;
  discoveredAt: string;
  origin: OriginBadge;
  source: string;
}

export type AccessScope =
  | "Email"
  | "Source code"
  | "Cloud infra"
  | "Identity"
  | "CRM data"
  | "ITSM"
  | "Chat"
  | "Payroll / HR";

export interface ScopeAccess {
  scope: AccessScope;
  read: number;
  write: number;
  execute: number;
  user: number;
  admin: number;
}

export type ApprovalStatus = "Pending" | "Approved" | "Rejected" | "Expired";

export interface Approval {
  id: string;
  agent: string;
  requestedBy: string;
  approver: string | null;
  status: ApprovalStatus;
  requestedAt: string;
  decidedAt: string | null;
  scope: AccessScope;
  justification: string;
}

export type ComplianceState = "Pass" | "Partial" | "Gap";

export interface ComplianceControl {
  framework: "NIST AI RMF" | "ISO 42001" | "SOC 2" | "OWASP LLM Top 10";
  control: string;
  title: string;
  state: ComplianceState;
  agentsInScope: number;
  evidenceCount: number;
  requirement?: string;
  gapSummary?: string;
  recommendedActions?: string[];
  sampleEvidence?: string[];
}

export interface SiemConnector {
  name: string;
  category: "SIEM" | "Ticketing" | "Identity" | "Observability";
  status: "Connected" | "Degraded" | "Not configured";
  lastEvent: string | null;
  eventsPer24h: number;
  detectionsActive: number;
  alertsOpen: number;
  ingestGb24h: number;
  latencyMs: number;
  sparkline: number[];
  notes?: string;
}

export interface PolicyTemplate {
  id: string;
  when: string;
  and: string | null;
  then: "Deny" | "Warn" | "Require approval";
  category: AccessScope;
  enabled: boolean;
}

export type CallerSurface =
  | "Internal LLM gateway"
  | "Vector DB API"
  | "Embeddings API"
  | "Tool API (MCP)"
  | "Fine-tune API";

export type CallerEnforcement = "Blocked" | "Warned" | "Observed";

export interface UnapprovedCaller {
  id: string;
  identity: string;
  identityType: "User token" | "Service account" | "CI job" | "Unknown";
  surface: CallerSurface;
  endpoint: string;
  sourceEnv: Environment;
  callCount24h: number;
  lastSeen: string;
  reason: string;
  enforcement: CallerEnforcement;
  suggestedAgent: string | null;
}

export interface ExecKpi {
  label: string;
  value: string;
  delta: number;
  unit?: string;
  good: "up" | "down";
}
