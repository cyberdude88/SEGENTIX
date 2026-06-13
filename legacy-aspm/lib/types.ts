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

export type RiskClass = "Read" | "Write" | "Modify" | "Delete" | "Admin";
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
