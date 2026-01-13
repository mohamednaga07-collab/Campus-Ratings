import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthForm } from "@/components/AuthForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GraduationCap, Star, BarChart3, Shield, Users, ChevronRight, CheckCircle, MapPin } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import styles from "./Landing.module.css";

interface LandingProps {
  defaultTab?: "login" | "register";
}



export default function Landing({ defaultTab = "login" }: LandingProps) {
  const { t } = useTranslation();

  const handleGetStarted = () => {
    const el = document.getElementById("auth-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-[100] w-full border-b bg-background/95 backdrop-blur-md shadow-sm">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-bold text-xl">{t("brand.name")}</span>
          </div>
          <div className="flex items-center gap-6 pr-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Original Split-Hero Section */}
        <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden">
          {/* Static Premium Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1523050335392-93851179ae2c?w=3840&h=2160&fit=crop&q=95&auto=format" 
              className="w-full h-full object-cover" 
              alt="Campus Background" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
          </div>

          <div className="container mx-auto px-4 relative z-10 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side: Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  {t("landing.badge.anonymous")}
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                  {t("landing.hero.title")}
                  <span className="text-blue-400 block mt-3">{t("landing.hero.highlight")}</span>
                </h1>

                <p className="text-xl text-slate-200 max-w-xl leading-relaxed">
                  {t("landing.hero.description")}
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                    <span className="text-lg font-medium">{t("landing.hero.features.anonymous")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-400" />
                    <span className="text-lg font-medium">5-Factor Ratings</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Side: Auth Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                id="auth-section"
              >
                <Card className="bg-card/95 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden max-w-md mx-auto lg:ml-auto">
                  <CardContent className="p-0">
                    <AuthForm defaultTab={defaultTab} />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold mb-6">{t("landing.features.title")}</h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t("landing.features.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  key: "factors",
                  icon: Star,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
                {
                  key: "comparison",
                  icon: BarChart3,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  key: "anonymity",
                  icon: Shield,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
              ].map((feature) => (
                <motion.div
                  key={feature.key}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border border-border/40 shadow-xl bg-card hover:shadow-2xl transition-all duration-300">
                    <CardContent className="pt-10 pb-10 px-8 text-center">
                      <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 mx-auto`}>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">
                        {t(`landing.features.cards.${feature.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {t(`landing.features.cards.${feature.key}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl font-bold mb-6">{t("landing.roles.title")}</h2>
              <p className="text-muted-foreground text-xl leading-relaxed">
                {t("landing.roles.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  key: "student",
                  icon: Users,
                  color: "text-indigo-500",
                  border: "border-indigo-500/20",
                },
                {
                  key: "teacher",
                  icon: GraduationCap,
                  color: "text-purple-500",
                  border: "border-purple-500/20",
                },
                {
                  key: "admin",
                  icon: Shield,
                  color: "text-slate-600",
                  border: "border-slate-500/20",
                },
              ].map((role) => (
                <motion.div
                  key={role.key}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Card className={`h-full border ${role.border} shadow-lg text-center overflow-hidden hover:shadow-2xl transition-all`}>
                    <CardContent className="pt-12 pb-12 px-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-8">
                        <role.icon className={`h-10 w-10 ${role.color}`} />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{t(`roles.${role.key}`)}</h3>
                      <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                        {t(`landing.roles.cards.${role.key}`)}
                      </p>
                      <Button onClick={handleGetStarted} className="w-full h-12 text-lg font-semibold">
                        {t("landing.getStarted")}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-4 border-t bg-slate-50 dark:bg-slate-950/20">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">{t("brand.name")}</span>
          </div>
          <p className="text-muted-foreground">
            {t("landing.footer.tagline")}
          </p>
          <div className="text-sm text-muted-foreground/60">
            © 2026 ProfRate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
