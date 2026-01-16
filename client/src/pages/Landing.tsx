import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthForm } from "@/components/AuthForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GraduationCap, Star, BarChart3, Shield, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface LandingProps {
  defaultTab?: "login" | "register";
}

export default function Landing({ defaultTab = "login" }: LandingProps) {
  const { t } = useTranslation();

  const scrollToAuth = () => {
    const el = document.getElementById("auth-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl tracking-tight">{t("brand.name")}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" className="hidden sm:inline-flex" onClick={scrollToAuth}>
              {t("auth.login")}
            </Button>
            <Button size="sm" onClick={scrollToAuth} className="sm:hidden">
              {t("auth.getStarted")}
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Split Hero Section */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
          {/* Abstract Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20 dark:opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/20 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Column: Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl text-center lg:text-left space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  <span>{t("landing.badge.anonymous")}</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  {t("landing.hero.title")}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                    {t("landing.hero.titleEmphasis")}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                  {t("landing.hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                  <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25" onClick={scrollToAuth}>
                    {t("auth.getStarted")}
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })}>
                    {t("landing.learnMore")}
                  </Button>
                </div>

                {/* Social Proof / Stats Mini */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 border-t border-border/50">
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-bold">10k+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("landing.stats.reviews")}</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-bold">500+</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{t("landing.stats.doctors")}</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <span className="text-2xl font-bold">4.9/5</span>
                    <div className="flex gap-0.5 text-amber-500">
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Auth Card */}
              <motion.div
                id="auth-section"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative lg:ml-auto w-full max-w-md mx-auto"
              >
                {/* Visual Polish behind card */}
                <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-2 scale-105 -z-10" />
                <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-border/50 overflow-hidden">
                  <AuthForm defaultTab={defaultTab} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">{t("landing.features.title")}</h2>
              <p className="text-muted-foreground">{t("landing.features.description")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, title: t("landing.features.anonymity"), desc: t("landing.features.anonymityDesc") },
                { icon: BarChart3, title: t("landing.features.insights"), desc: t("landing.features.insightsDesc") },
                { icon: Star, title: t("landing.features.quality"), desc: t("landing.features.qualityDesc") }
              ].map((feature, i) => (
                <Card key={i} className="bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-sm">
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
            <GraduationCap className="h-5 w-5" />
            <span className="font-bold">{t("brand.name")}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t("brand.name")}. {t("brand.rights")}
          </p>
        </div>
      </footer>
    </div>
  );
}

// Minimal Card components for clean layout
function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "" }) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}
