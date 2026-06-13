import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-[13px] font-medium tracking-tight">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-fg-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-[12px] text-fg-muted hover:text-fg"
        >
          {action.label}
          <ArrowUpRight size={12} />
        </Link>
      )}
    </div>
  );
}
