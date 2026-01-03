import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthForm } from "@/components/AuthForm";
import { GraduationCap, Star, BarChart3, Shield, Users, ChevronRight, CheckCircle, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero carousel images - 4K resolution with 8 diverse education images
  const heroImages = [
    "https://images.unsplash.com/photo-1460518451285-97b6aa326961?w=2560&h=1440&fit=crop&q=95&auto=format", // lecture hall
    "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=2560&h=1440&fit=crop&q=95&auto=format", // laptop coding page in library
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=2560&h=1440&fit=crop&q=95&auto=format", // study group
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=2560&h=1440&fit=crop&q=95&auto=format", // students collaborating
    "https://images.unsplash.com/photo-1503676382389-4809596d5290?w=2560&h=1440&fit=crop&q=95&auto=format", // library desk
    "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=2560&h=1440&fit=crop&q=95&auto=format", // campus walkway
    "https://images.unsplash.com/photo-1516383607781-913a19294fd1?w=2560&h=1440&fit=crop&q=95&auto=format", // students brainstorming at whiteboard
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=2560&h=1440&fit=crop&q=95&auto=format", // professor on stage explaining code
  ];

  // Preload images
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Smooth carousel rotation - faster transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollToAuth = () => {
    const el = document.getElementById("auth-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGetStarted = scrollToAuth;
  const handleLogin = scrollToAuth;

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
        {/* Hero Section with Image Carousel */}
        <section className="relative h-96 lg:h-[500px] overflow-hidden bg-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 will-change-opacity"
              style={{
                backgroundImage: `url(${heroImages[currentImageIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                backgroundColor: "#0f172a",
              }}
            />
          </AnimatePresence>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/50 pointer-events-none" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="container mx-auto max-w-4xl text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium mb-6">
                  <Shield className="h-4 w-4" />
                  {t("landing.badge.anonymous")}
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-white">
                  {t("landing.hero.title")}
                  <span className="text-blue-400 block mt-2">{t("landing.hero.highlight")}</span>
                </h1>

                <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
                  {t("landing.hero.description")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" onClick={handleGetStarted} data-testid="button-get-started">
                    {t("landing.getStarted")}
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <a href="#features">{t("landing.learnMore")}</a>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white w-6" : "bg-white/40 w-2"
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </section>

        <section id="features" className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-4">{t("landing.features.title")}</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                {t("landing.features.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Star,
                  titleKey: "landing.features.cards.factors.title",
                  descKey: "landing.features.cards.factors.description",
                  color: "primary",
                },
                {
                  icon: BarChart3,
                  titleKey: "landing.features.cards.comparison.title",
                  descKey: "landing.features.cards.comparison.description",
                  color: "primary",
                },
                {
                  icon: Shield,
                  titleKey: "landing.features.cards.anonymity.title",
                  descKey: "landing.features.cards.anonymity.description",
                  color: "primary",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 bg-card backdrop-blur hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-8">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t(item.titleKey)}</h3>
                      <p className="text-muted-foreground">
                        {t(item.descKey)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-center mb-4">{t("landing.roles.title")}</h2>
              <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                {t("landing.roles.subtitle")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  role: "student",
                  color: "chart-1",
                },
                {
                  icon: GraduationCap,
                  role: "teacher",
                  color: "chart-2",
                },
                {
                  icon: Shield,
                  role: "admin",
                  color: "chart-4",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="backdrop-blur hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-8 text-center">
                      <div className={`h-16 w-16 rounded-full bg-${item.color}/10 flex items-center justify-center mx-auto mb-4`}>
                        <item.icon className={`h-8 w-8 text-${item.color}`} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{t(`roles.${item.role}`)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`landing.roles.cards.${item.role}`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="auth-section" className="py-20 px-4 bg-slate-950 text-white">
          <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-sm">
                <Shield className="h-4 w-4" />
                <span>{t("landing.hero.highlight")}</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight">
                {t("auth.login")}/{t("auth.register")}
                <span className="block text-blue-200 text-xl font-semibold mt-2">{t("landing.hero.title")}</span>
              </h2>
              <p className="text-white/80 max-w-xl">
                {t("landing.hero.description")}
              </p>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                  <span>Stay anonymous to peers while your profile stays verified.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-300 mt-0.5" />
                  <span>Sync saved campuses, educators, and follow-ups across devices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-sky-200 mt-0.5" />
                  <span>Surface nearby or online options tailored to your preferences.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-900/80 text-white shadow-2xl border border-white/10 backdrop-blur-xl">
                <CardContent className="p-6">
                  <AuthForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">{t("landing.final.title")}</h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                {t("landing.final.subtitle")}
              </p>
              <Button size="lg" variant="secondary" onClick={handleGetStarted}>
                {t("landing.getStarted")}
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
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
