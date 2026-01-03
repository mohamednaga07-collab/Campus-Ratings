import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { AlertCircle, TrendingUp, Award, Users, MessageSquare, BookOpen, Target, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface Doctor {
  id: number;
  name: string;
  department: string;
  title: string;
  bio: string;
  profileImageUrl: string | null;
  ratings: {
    avgTeachingQuality: number;
    avgAvailability: number;
    avgCommunication: number;
    avgKnowledge: number;
    avgFairness: number;
    overallRating: number;
    totalReviews: number;
  } | null;
}

interface Review {
  id: number;
  doctorId: number;
  teachingQuality: number;
  availability: number;
  communication: number;
  knowledge: number;
  fairness: number;
  comment: string | null;
  createdAt: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero images carousel
  const heroImages = [
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80", // Students learning
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80", // University lecture
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&q=80", // Note taking
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80", // Teacher presentation
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds per image
    return () => clearInterval(interval);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch all doctors to find self and see reviews
  const { data: doctors = [], isLoading: doctorsLoading } = useQuery({
    queryKey: ["/api/doctors"],
    queryFn: async () => {
      const res = await fetch("/api/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return res.json() as Promise<Doctor[]>;
    },
  });

  const teacherFullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  const normalizeDoctorName = (name: string) =>
    name.replace(/^Dr\.?\s+/i, "").trim().toLowerCase();

  const normalizedTeacherName = teacherFullName.toLowerCase();

  // Best-effort mapping: if a teacher account name matches a doctor name,
  // show only that doctor's stats. (There is no explicit DB relation yet.)
  const matchedDoctors =
    user?.role === "teacher" && normalizedTeacherName
      ? doctors.filter((doc) => normalizeDoctorName(doc.name) === normalizedTeacherName)
      : doctors;

  // Find current teacher's data - for now just show all doctors with ratings
  // In a real app, you'd have a /api/teacher/:id endpoint
  const teacherReviews = matchedDoctors.filter((doc) => doc.ratings && doc.ratings.totalReviews > 0);

  const chartData = matchedDoctors
    .filter((doc) => doc.ratings && doc.ratings.totalReviews > 0)
    .map((doc) => ({
      name: doc.name,
      Teaching: doc.ratings?.avgTeachingQuality ?? 0,
      Availability: doc.ratings?.avgAvailability ?? 0,
      Communication: doc.ratings?.avgCommunication ?? 0,
      Knowledge: doc.ratings?.avgKnowledge ?? 0,
      Fairness: doc.ratings?.avgFairness ?? 0,
    }));

  if (doctorsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">{t("teacherDashboard.loading")}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section with Animated Background Images */}
      <div className="relative h-72 overflow-hidden bg-gradient-to-r from-primary/90 to-primary">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.25, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
            style={{ mixBlendMode: 'soft-light' }}
          >
            <img
              src={heroImages[currentImageIndex]}
              alt="Education"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/85 z-10" />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-foreground animate-pulse" />
              <span className="text-primary-foreground/90 text-sm font-medium">
                {t("teacherDashboard.subtitle")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
              {t("teacherDashboard.title")}
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              {t("teacherDashboard.heroDescription", {
                defaultValue: "Track your teaching performance, student feedback, and continuous improvement metrics in real-time."
              })}
            </p>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-30">
        {user?.role === "teacher" && teacherFullName && matchedDoctors.length === 0 ? (
          <Alert className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-900 dark:text-amber-200">
              {t("teacherDashboard.noProfile", { name: teacherFullName })}
            </AlertDescription>
          </Alert>
        ) : teacherReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-8 border-dashed bg-card/50 backdrop-blur">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <AlertDescription className="text-lg">
                  {t("teacherDashboard.empty")}
                </AlertDescription>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Key Metrics Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {teacherReviews[0] && (
                <>
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200 dark:border-blue-800 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{t("teacherDashboard.stats.overallRating", { defaultValue: "Overall Rating" })}</p>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {teacherReviews[0].ratings?.overallRating.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{t("teacherDashboard.stats.overallRatingLabel", { defaultValue: "out of 5.0" })}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200 dark:border-green-800 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{t("teacherDashboard.stats.totalReviews", { defaultValue: "Total Reviews" })}</p>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {teacherReviews[0].ratings?.totalReviews ?? 0}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{t("teacherDashboard.stats.totalReviewsLabel", { defaultValue: "student feedback" })}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                          <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200 dark:border-purple-800 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{t("teacherDashboard.stats.topStrength", { defaultValue: "Strongest Factor" })}</p>
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {Math.max(
                              teacherReviews[0].ratings?.avgTeachingQuality ?? 0,
                              teacherReviews[0].ratings?.avgKnowledge ?? 0,
                              teacherReviews[0].ratings?.avgCommunication ?? 0
                            ).toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{t("teacherDashboard.stats.topStrengthLabel", { defaultValue: "top performance" })}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200 dark:border-orange-800 backdrop-blur">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{t("teacherDashboard.stats.engagement", { defaultValue: "Engagement Score" })}</p>
                          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                            {((teacherReviews[0].ratings?.avgAvailability ?? 0) * 20).toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{t("teacherDashboard.stats.engagementLabel", { defaultValue: "student engagement" })}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </motion.div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="backdrop-blur bg-card/80">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5" />
                      {t("teacherDashboard.chart.title")}
                    </CardTitle>
                    <CardDescription>{t("teacherDashboard.chart.description")}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                        <XAxis 
                          dataKey="name" 
                          angle={0} 
                          textAnchor="middle" 
                          height={80}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis
                          domain={[0, 5]}
                          label={{ value: t("teacherDashboard.chart.ratingLabel"), angle: -90, position: "insideLeft" }}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip 
                          formatter={(value: number) => value.toFixed(2)}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Legend />
                        <Bar dataKey="Teaching" name={t("doctorProfile.factorsShort.teaching")} fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Availability" name={t("doctorProfile.factorsShort.availability")} fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Communication" name={t("doctorProfile.factorsShort.communication")} fill="#ec4899" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Knowledge" name={t("doctorProfile.factorsShort.knowledge")} fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="Fairness" name={t("doctorProfile.factorsShort.fairness")} fill="#10b981" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Radar Chart */}
              {teacherReviews[0] && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="backdrop-blur bg-card/80">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        {t("teacherDashboard.radar.title", { defaultValue: "Performance Breakdown" })}
                      </CardTitle>
                      <CardDescription>
                        {t("teacherDashboard.radar.description", { defaultValue: "Visual representation of your teaching metrics" })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <RadarChart data={[
                          {
                            category: t("doctorProfile.factorsShort.teaching"),
                            value: teacherReviews[0].ratings?.avgTeachingQuality ?? 0,
                            fullMark: 5
                          },
                          {
                            category: t("doctorProfile.factorsShort.availability"),
                            value: teacherReviews[0].ratings?.avgAvailability ?? 0,
                            fullMark: 5
                          },
                          {
                            category: t("doctorProfile.factorsShort.communication"),
                            value: teacherReviews[0].ratings?.avgCommunication ?? 0,
                            fullMark: 5
                          },
                          {
                            category: t("doctorProfile.factorsShort.knowledge"),
                            value: teacherReviews[0].ratings?.avgKnowledge ?? 0,
                            fullMark: 5
                          },
                          {
                            category: t("doctorProfile.factorsShort.fairness"),
                            value: teacherReviews[0].ratings?.avgFairness ?? 0,
                            fullMark: 5
                          },
                        ]}>
                          <PolarGrid stroke="hsl(var(--muted))" />
                          <PolarAngleAxis 
                            dataKey="category" 
                            stroke="hsl(var(--muted-foreground))"
                            tick={(props: any) => {
                              const { x, y, payload, index } = props;
                              // Optimized positions with better spacing and fitting colors
                              const config = [
                                { dx: 0, dy: -12, color: "#3b82f6" },      // Top (Teaching - Blue) - lowered
                                { dx: 20, dy: -6, color: "#8b5cf6" },      // Top-right (Availability - Purple) - moved right
                                { dx: 12, dy: 14, color: "#10b981" },      // Bottom-right (Communication - Green)
                                { dx: -12, dy: 14, color: "#f59e0b" },     // Bottom-left (Knowledge - Amber)
                                { dx: -20, dy: -6, color: "#ec4899" }      // Top-left (Fairness - Rose) - moved left
                              ];
                              const position = config[index] || { dx: 0, dy: 4, color: "hsl(var(--muted-foreground))" };
                              return (
                                <text 
                                  x={x + position.dx} 
                                  y={y + position.dy} 
                                  textAnchor="middle" 
                                  fill={position.color}
                                  fontSize={14}
                                  fontWeight={500}
                                >
                                  {payload.value}
                                </text>
                              );
                            }}
                          />
                          <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="hsl(var(--muted-foreground))" tick={false} />
                          <Radar 
                            name="Your Ratings" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.6} 
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>

            {/* Individual Detailed Ratings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid gap-6"
            >
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">{t("teacherDashboard.yourFeedback")}</h2>
              </div>
              
              {teacherReviews.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className="backdrop-blur bg-card/80 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{doctor.name}</CardTitle>
                            <CardDescription className="text-base mt-1">
                              {doctor.title} • {doctor.department}
                            </CardDescription>
                            <div className="flex items-center gap-2 mt-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {doctor.ratings?.totalReviews ?? 0}{" "}
                                {t("teacherDashboard.reviewsCount", { count: doctor.ratings?.totalReviews ?? 0 })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            {doctor.ratings?.overallRating.toFixed(1)}
                          </div>
                          <StarRating rating={doctor.ratings?.overallRating ?? 0} size="sm" />
                          <div className="text-sm text-muted-foreground mt-1">{t("compare.overall")}</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {t("doctorProfile.factors.teachingQuality")}
                          </div>
                          <StarRating rating={doctor.ratings?.avgTeachingQuality ?? 0} size="sm" />
                          <div className="text-2xl font-bold mt-2 text-blue-600 dark:text-blue-400">
                            {doctor.ratings?.avgTeachingQuality.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-200 dark:border-purple-800">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {t("doctorProfile.factors.availability")}
                          </div>
                          <StarRating rating={doctor.ratings?.avgAvailability ?? 0} size="sm" />
                          <div className="text-2xl font-bold mt-2 text-purple-600 dark:text-purple-400">
                            {doctor.ratings?.avgAvailability.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-200 dark:border-pink-800">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {t("doctorProfile.factors.communication")}
                          </div>
                          <StarRating rating={doctor.ratings?.avgCommunication ?? 0} size="sm" />
                          <div className="text-2xl font-bold mt-2 text-pink-600 dark:text-pink-400">
                            {doctor.ratings?.avgCommunication.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {t("doctorProfile.factors.knowledge")}
                          </div>
                          <StarRating rating={doctor.ratings?.avgKnowledge ?? 0} size="sm" />
                          <div className="text-2xl font-bold mt-2 text-amber-600 dark:text-amber-400">
                            {doctor.ratings?.avgKnowledge.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-green-500/10 border border-green-200 dark:border-green-800">
                          <div className="text-sm font-medium text-muted-foreground mb-2">
                            {t("doctorProfile.factors.fairness")}
                          </div>
                          <StarRating rating={doctor.ratings?.avgFairness ?? 0} size="sm" />
                          <div className="text-2xl font-bold mt-2 text-green-600 dark:text-green-400">
                            {doctor.ratings?.avgFairness.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
