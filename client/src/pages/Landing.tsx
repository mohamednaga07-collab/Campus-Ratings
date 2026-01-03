import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthForm } from "@/components/AuthForm";
import { GraduationCap, Star, BarChart3, Shield, Users, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showRoleSelect, setShowRoleSelect] = useState(false);

  const handleGetStarted = () => {
    setShowRoleSelect(true);
  };

  const handleLogin = () => {
    setShowRoleSelect(true);
  };

  // Check if a previous action requested the role selector (e.g. header login)
  useEffect(() => {
    try {
      const v = localStorage.getItem("showRoleSelect");
      if (v) {
        setShowRoleSelect(true);
        localStorage.removeItem("showRoleSelect");
      }
    } catch (e) {
      // ignore
    }
  }, []);
  
  // Also honor a query parameter (e.g. /?showRoleSelect=1) so server
  // redirects to /api/login can open the role selector when auth is disabled.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("showRoleSelect") === "1") {
        setShowRoleSelect(true);
        // remove the param from the URL without reloading
        params.delete("showRoleSelect");
        const base = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, document.title, base);
      }
    } catch (e) {
      // ignore
    }
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">{t("brand.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={handleLogin} data-testid="button-landing-login">
              {t("auth.login")}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Shield className="h-4 w-4" />
              {t("landing.badge.anonymous")}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              {t("landing.hero.title")}
              <span className="text-primary block mt-2">{t("landing.hero.highlight")}</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t("landing.hero.description")}
            </p>

            {showRoleSelect ? (
              <div id="auth-form-container" className="max-w-md mx-auto mb-10">
                <AuthForm onSuccess={() => setShowRoleSelect(false)} />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={handleGetStarted} data-testid="button-get-started">
                  {t("landing.getStarted")}
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">{t("landing.learnMore")}</a>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-4">{t("landing.features.title")}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              {t("landing.features.subtitle")}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-0 bg-card">
                <CardContent className="pt-8 pb-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("landing.features.cards.factors.title")}</h3>
                  <p className="text-muted-foreground">
                    {t("landing.features.cards.factors.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="pt-8 pb-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("landing.features.cards.comparison.title")}</h3>
                  <p className="text-muted-foreground">
                    {t("landing.features.cards.comparison.description")}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card">
                <CardContent className="pt-8 pb-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("landing.features.cards.anonymity.title")}</h3>
                  <p className="text-muted-foreground">
                    {t("landing.features.cards.anonymity.description")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-4">{t("landing.roles.title")}</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              {t("landing.roles.subtitle")}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-chart-1/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-chart-1" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("roles.student")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.roles.cards.student")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-chart-2" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("roles.teacher")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.roles.cards.teacher")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-chart-4/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-chart-4" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t("roles.admin")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("landing.roles.cards.admin")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">{t("landing.final.title")}</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              {t("landing.final.subtitle")}
            </p>
            <Button size="lg" variant="secondary" onClick={() => {
              setShowRoleSelect(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              {t("landing.getStarted")}
              <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("brand.name")}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("landing.footer.tagline")}
          </p>
        </div>
      </footer>
    </div>
  );
}
