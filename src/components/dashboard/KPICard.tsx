import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function KPICard({ title, value, icon: Icon, trend, className, onClick }: KPICardProps) {
  return (
    <Card 
      className={cn(
        "hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50",
        "bg-gradient-to-br from-card to-surface",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <p className="text-[0.85rem] font-medium text-muted-foreground leading-tight">{title}</p>
            <p className="text-[1.8rem] font-semibold leading-none">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-medium flex items-center",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-xl">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
