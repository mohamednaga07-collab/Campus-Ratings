import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "@/components/StarRating";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

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

  // Find current teacher's data - for now just show all doctors with ratings
  // In a real app, you'd have a /api/teacher/:id endpoint
  const teacherReviews = doctors.filter((doc) => doc.ratings && doc.ratings.totalReviews > 0);

  const chartData = doctors
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("teacherDashboard.title")}</h1>
          <p className="text-muted-foreground">{t("teacherDashboard.subtitle")}</p>
        </div>

        {teacherReviews.length === 0 ? (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t("teacherDashboard.empty")}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Rating Chart */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t("teacherDashboard.chart.title")}</CardTitle>
                <CardDescription>{t("teacherDashboard.chart.description")}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis
                      domain={[0, 5]}
                      label={{ value: t("teacherDashboard.chart.ratingLabel"), angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} />
                    <Legend />
                    <Bar dataKey="Teaching" name={t("doctorProfile.factorsShort.teaching")} fill="#3b82f6" />
                    <Bar dataKey="Availability" name={t("doctorProfile.factorsShort.availability")} fill="#8b5cf6" />
                    <Bar dataKey="Communication" name={t("doctorProfile.factorsShort.communication")} fill="#ec4899" />
                    <Bar dataKey="Knowledge" name={t("doctorProfile.factorsShort.knowledge")} fill="#f59e0b" />
                    <Bar dataKey="Fairness" name={t("doctorProfile.factorsShort.fairness")} fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Individual Ratings */}
            <div className="grid gap-6">
              <h2 className="text-2xl font-bold">{t("teacherDashboard.yourFeedback")}</h2>
              {teacherReviews.map((doctor) => (
                <Card key={doctor.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{doctor.name}</CardTitle>
                        <CardDescription>
                          {doctor.title} • {doctor.department} • {doctor.ratings?.totalReviews ?? 0}{" "}
                          {t("teacherDashboard.reviewsCount", { count: doctor.ratings?.totalReviews ?? 0 })}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{doctor.ratings?.overallRating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">{t("compare.overall")}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{t("doctorProfile.factors.teachingQuality")}</div>
                        <StarRating rating={doctor.ratings?.avgTeachingQuality ?? 0} size="sm" />
                        <div className="text-sm mt-1">{doctor.ratings?.avgTeachingQuality.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{t("doctorProfile.factors.availability")}</div>
                        <StarRating rating={doctor.ratings?.avgAvailability ?? 0} size="sm" />
                        <div className="text-sm mt-1">{doctor.ratings?.avgAvailability.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{t("doctorProfile.factors.communication")}</div>
                        <StarRating rating={doctor.ratings?.avgCommunication ?? 0} size="sm" />
                        <div className="text-sm mt-1">{doctor.ratings?.avgCommunication.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{t("doctorProfile.factors.knowledge")}</div>
                        <StarRating rating={doctor.ratings?.avgKnowledge ?? 0} size="sm" />
                        <div className="text-sm mt-1">{doctor.ratings?.avgKnowledge.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">{t("doctorProfile.factors.fairness")}</div>
                        <StarRating rating={doctor.ratings?.avgFairness ?? 0} size="sm" />
                        <div className="text-sm mt-1">{doctor.ratings?.avgFairness.toFixed(1)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
