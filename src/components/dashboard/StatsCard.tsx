import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "#2563eb",
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtitle?: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-[#1e3a5f]">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div
          className={cn("flex h-12 w-12 items-center justify-center rounded-xl")}
          style={{ backgroundColor: `${color}1a` }}
        >
          <Icon className="h-6 w-6" style={{ color }} />
        </div>
      </div>
    </Card>
  );
}
