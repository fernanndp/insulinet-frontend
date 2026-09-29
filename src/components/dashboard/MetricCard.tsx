import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <article className="dashboard-metric-card">
      <div className="dashboard-metric-header">
        <span className="dashboard-metric-title">
          {title}
        </span>

        <div className="dashboard-metric-icon">
          <Icon size={18} strokeWidth={2} />
        </div>
      </div>

      <strong className="dashboard-metric-value">
        {value}
      </strong>

      <span className="dashboard-metric-description">
        {description}
      </span>
    </article>
  );
}