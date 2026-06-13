import PolicyRuleList from "@/components/policies/PolicyRuleList";

export default function PoliciesPage() {
  return (
    <div className="px-4 md:px-6 py-5 max-w-[1440px] mx-auto space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Policies</h1>
        <p className="text-[12px] text-fg-muted">
          Allow and deny rules applied at the posture layer. Runtime gateway
          enforcement is on the roadmap.
        </p>
      </div>
      <PolicyRuleList />
    </div>
  );
}
