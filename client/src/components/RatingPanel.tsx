import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Zap, Users, MessageCircle, Target, Check, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface RatingFactor {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface RatingPanelProps {
  factors: RatingFactor[];
  title: string;
  description?: string;
  tooltip?: string;
  onRatingsChange?: (ratings: Record<string, number>) => void;
  showGuide?: boolean;
  compactMode?: boolean;
}

export function RatingPanel({
  factors,
  title,
  description,
  tooltip,
  onRatingsChange,
  showGuide = true,
  compactMode = false,
}: RatingPanelProps) {
  const { t } = useTranslation();
  const [ratings, setRatings] = useState<Record<string, number>>(
    factors.reduce((acc, f) => ({ ...acc, [f.key]: 0 }), {}),
  );
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null);
  const onRatingsChangeRef = useRef(onRatingsChange);
  
  // Update ref when callback changes
  useEffect(() => {
    onRatingsChangeRef.current = onRatingsChange;
  }, [onRatingsChange]);

  // Notify parent when ratings change
  useEffect(() => {
    onRatingsChangeRef.current?.(ratings);
  }, [ratings]);

  const allRated = Object.values(ratings).every((v) => v > 0);
  const averageRating =
    Object.values(ratings).length > 0
      ? Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
      : 0;
  const averageRatingDisplay = averageRating.toFixed(1);

  const getRatingColor = (value: number) => {
    if (value >= 4.5) return "text-emerald-500";
    if (value >= 4) return "text-green-500";
    if (value >= 3.5) return "text-blue-500";
    if (value >= 3) return "text-yellow-500";
    if (value >= 2) return "text-orange-500";
    return "text-red-500";
  };

  const getRatingLabel = (value: number) => {
    if (value === 0) return t("rating.notRated", { defaultValue: "Not Rated" });
    if (value >= 4.5) return t("rating.excellent", { defaultValue: "Excellent" });
    if (value >= 4) return t("rating.good", { defaultValue: "Good" });
    if (value >= 3.5) return t("rating.satisfactory", { defaultValue: "Satisfactory" });
    if (value >= 3) return t("rating.fair", { defaultValue: "Fair" });
    if (value >= 2) return t("rating.poor", { defaultValue: "Poor" });
    return t("rating.veryPoor", { defaultValue: "Very Poor" });
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-5 w-5 text-primary/40 cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p>
                  {tooltip ||
                    t(
                      "rating.tooltip",
                      {
                        defaultValue: "Rate each factor honestly. Your feedback is completely anonymous.",
                      },
                    )}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-4 border border-primary/20"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t("rating.progress", { defaultValue: "Your Rating" })}</span>
                {allRated && <Check className="h-4 w-4 text-emerald-500" />}
              </div>
              {averageRating > 0 && (
                <Badge className="gap-1 bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 fill-current" />
                  {averageRatingDisplay} / 5
                </Badge>
              )}
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(Object.values(ratings).filter((v) => v > 0).length / factors.length) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Object.values(ratings).filter((v) => v > 0).length} / {factors.length}{" "}
              {t("rating.factorsRated", { defaultValue: "factors rated" })}
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Rating Factors */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {factors.map((factor, idx) => {
                const value = ratings[factor.key];
                const isHovered = hoveredFactor === factor.key;

                return (
                  <motion.div
                    key={factor.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className={`rounded-lg p-4 transition-colors ${
                      isHovered ? "bg-primary/5 border-primary/20" : "border-transparent"
                    } border`}
                    onMouseEnter={() => setHoveredFactor(factor.key)}
                    onMouseLeave={() => setHoveredFactor(null)}
                  >
                    {/* Factor Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1 text-primary/60">{factor.icon}</div>
                        <div className="flex-1">
                          <Label className="text-base font-semibold">{factor.label}</Label>
                          <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
                        </div>
                      </div>
                      <div className="ml-4">
                        {value > 0 && (
                          <Badge className={`gap-1 ${getRatingColor(value)}`} variant="secondary">
                            <Star className="h-3 w-3" />
                            {value.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Slider */}
                    <div className="space-y-3">
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => setRatings((prev) => ({ ...prev, [factor.key]: v }))}
                        min={0}
                        max={5}
                        step={0.5}
                        className="cursor-pointer"
                      />

                      {/* Rating Label and Scale */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${value > 0 ? getRatingColor(value) : "text-muted-foreground"}`}
                        >
                          {getRatingLabel(value)}
                        </span>
                        <span className="text-xs text-muted-foreground">0 - 5.0</span>
                      </div>

                      {/* Star Visualization */}
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            type="button"
                            onClick={() => setRatings((prev) => ({ ...prev, [factor.key]: star }))}
                            className="relative group"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              animate={{
                                color: value >= star ? "rgb(234, 179, 8)" : "rgb(229, 231, 235)",
                              }}
                            >
                              <Star className="h-5 w-5 fill-current transition-colors" />
                            </motion.div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                              <Badge className="whitespace-nowrap text-xs">{star}.0</Badge>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Guide Section */}
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg bg-secondary/30 p-4 border border-secondary/40"
            >
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {t("rating.ratingGuide", { defaultValue: "Rating Guide" })}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-500 min-w-fit">4.5 - 5.0:</span>
                  <span>{t("rating.guide.excellent", { defaultValue: "Excellent - Outstanding performance" })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-green-500 min-w-fit">4.0 - 4.4:</span>
                  <span>{t("rating.guide.good", { defaultValue: "Good - Above average performance" })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-blue-500 min-w-fit">3.5 - 3.9:</span>
                  <span>{t("rating.guide.satisfactory", { defaultValue: "Satisfactory - Meets expectations" })}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-yellow-500 min-w-fit">3.0 - 3.4:</span>
                  <span>
                    {t("rating.guide.fair", { defaultValue: "Fair - Below average but acceptable" })}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-orange-500 min-w-fit">1.0 - 2.9:</span>
                  <span>{t("rating.guide.poor", { defaultValue: "Poor - Significant room for improvement" })}</span>
                </li>
              </ul>
            </motion.div>
          )}

          {/* Footer Note */}
          <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Users className="h-4 w-4 text-primary/60 mt-0.5 flex-shrink-0" />
              {t(
                "rating.privacyNote",
                {
                  defaultValue:
                    "Your feedback is completely anonymous. We never collect identifying information with your ratings.",
                },
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
