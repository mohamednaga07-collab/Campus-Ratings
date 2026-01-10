import { LucideIcon, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange" | "red";
  trend?: number;
  className?: string;
  decimals?: number;
}

const colorStyles = {
  blue: {
    bg: "bg-blue-50/50 dark:bg-blue-950/50",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500/10 to-transparent",
  },
  green: {
    bg: "bg-green-50/50 dark:bg-green-950/50",
    iconBg: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-600 dark:text-green-400",
    gradient: "from-green-500/10 to-transparent",
  },
  purple: {
    bg: "bg-purple-50/50 dark:bg-purple-950/50",
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    textColor: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500/10 to-transparent",
  },
  orange: {
    bg: "bg-orange-50/50 dark:bg-orange-950/50",
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    textColor: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500/10 to-transparent",
  },
  red: {
    bg: "bg-red-50/50 dark:bg-red-950/50",
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-600 dark:text-red-400",
    textColor: "text-red-600 dark:text-red-400",
    gradient: "from-red-500/10 to-transparent",
  },
};

export function StatCard({ title, value, icon: Icon, color, trend, className, decimals = 0 }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <Card className={cn(
      "border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden group h-full",
      styles.bg,
      className
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", styles.gradient)} />
      
      <CardContent className="p-4 h-full flex flex-col justify-between relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div className={cn("h-10 w-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110", styles.iconBg)}>
            <Icon className={cn("h-5 w-5", styles.iconColor)} />
          </div>
          {typeof trend === 'number' && (
            <Badge variant="secondary" className="gap-1 bg-background/50 backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" />
              {trend > 0 ? "+" : ""}{trend.toFixed(1)}%
            </Badge>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-0.5">{title}</p>
          <h3 className={cn("text-3xl font-bold tracking-tight", styles.textColor)}>
            <AnimatedNumber value={value} decimals={decimals} />
          </h3>
        </div>
      </CardContent>
    </Card>
  );
}
