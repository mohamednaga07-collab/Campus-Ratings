import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, Award, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface ComparisonFactor {
  key: string;
  label: string;
  valueA: number;
  valueB: number;
  maxValue?: number;
}

interface ComparisonPanelProps {
  title: string;
  description?: string;
  factors: ComparisonFactor[];
  nameA: string;
  nameB: string;
  highlightWinner?: boolean;
  compactMode?: boolean;
}

export function ComparisonPanel({
  title,
  description,
  factors,
  nameA,
  nameB,
  highlightWinner = true,
  compactMode = false,
}: ComparisonPanelProps) {
  const { t } = useTranslation();
  const maxValue = 5;

  const getWinnerInfo = (valueA: number, valueB: number) => {
    if (valueA > valueB) return { winner: "a", diff: (valueA - valueB).toFixed(1) };
    if (valueB > valueA) return { winner: "b", diff: (valueB - valueA).toFixed(1) };
    return { winner: null, diff: "0" };
  };

  const getBarColor = (value: number) => {
    if (value >= 4.5) return "from-emerald-500 to-teal-500";
    if (value >= 4) return "from-green-500 to-emerald-500";
    if (value >= 3.5) return "from-blue-500 to-cyan-500";
    if (value >= 3) return "from-yellow-500 to-amber-500";
    if (value >= 2) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-500";
  };

  const getBadgeVariant = (winner: string | null, side: "a" | "b") => {
    if (!highlightWinner) return "outline";
    if (winner === side) return "default";
    return "outline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border border-primary/10 shadow-lg shadow-primary/5 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{title}</CardTitle>
              {description && <CardDescription className="mt-2">{description}</CardDescription>}
            </div>
            <Award className="h-5 w-5 text-primary/40" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Header Row */}
          <div className={`grid gap-4 ${compactMode ? "grid-cols-3" : "grid-cols-[2fr_1fr_1fr]"}`}>
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {t("common.factor", { defaultValue: "Factor" })}
            </div>
            <div className="text-right text-sm font-semibold text-foreground">{nameA}</div>
            <div className="text-right text-sm font-semibold text-foreground">{nameB}</div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Factor Rows */}
          <div className="space-y-5">
            {factors.map((factor) => {
              const winner = getWinnerInfo(factor.valueA, factor.valueB);
              const percentA = (factor.valueA / maxValue) * 100;
              const percentB = (factor.valueB / maxValue) * 100;

              return (
                <motion.div
                  key={factor.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {/* Factor Label */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{factor.label}</label>
                    {winner.winner && highlightWinner && (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-xs"
                      >
                        <TrendingUp className="h-3 w-3" />
                        +{winner.diff}
                      </Badge>
                    )}
                  </div>

                  {/* Comparison Bars */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Side A */}
                    <motion.div
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-8 flex-1 overflow-hidden rounded-lg bg-muted/50">
                          <motion.div
                            className={`h-full rounded-lg bg-gradient-to-r ${getBarColor(
                              factor.valueA,
                            )} shadow-sm`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentA}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                        <div className="ml-3 flex items-baseline gap-1 whitespace-nowrap">
                          <Badge
                            variant={getBadgeVariant(winner.winner, "a")}
                            className={`${winner.winner === "a" ? "bg-primary text-primary-foreground" : ""}`}
                          >
                            {factor.valueA.toFixed(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">/ {maxValue}</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Side B */}
                    <motion.div
                      className="space-y-2"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="h-8 flex-1 overflow-hidden rounded-lg bg-muted/50">
                          <motion.div
                            className={`h-full rounded-lg bg-gradient-to-r ${getBarColor(
                              factor.valueB,
                            )} shadow-sm`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentB}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                        <div className="ml-3 flex items-baseline gap-1 whitespace-nowrap">
                          <Badge
                            variant={getBadgeVariant(winner.winner, "b")}
                            className={`${winner.winner === "b" ? "bg-primary text-primary-foreground" : ""}`}
                          >
                            {factor.valueB.toFixed(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">/ {maxValue}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary Footer */}
          <div className="mt-6 rounded-lg bg-primary/5 p-4 border border-primary/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t(
                  "comparison.note",
                  {
                    defaultValue:
                      "Higher scores indicate better performance. All ratings are based on anonymous student reviews.",
                  },
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
