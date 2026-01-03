import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import DoctorListing from "@/pages/DoctorListing";
import DoctorProfile from "@/pages/DoctorProfile";
import Compare from "@/pages/Compare";
import TeacherDashboard from "@/pages/TeacherDashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ForgotUsername from "@/pages/ForgotUsername";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/not-found";
import { useTranslation } from "react-i18next";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

function AnimatedPageWrapper({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return (
    <motion.div
      key={location}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location] = useLocation();
  const { t } = useTranslation();

  console.log("🔄 Router render - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "user:", user?.username);

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Switch location={location}>
        {/* Public routes - always accessible */}
        <Route path="/reset-password">
          {() => (
            <AnimatedPageWrapper>
              <ResetPassword />
            </AnimatedPageWrapper>
          )}
        </Route>
        <Route path="/forgot-password">
          {() => (
            <AnimatedPageWrapper>
              <ForgotPassword />
            </AnimatedPageWrapper>
          )}
        </Route>
        <Route path="/forgot-username">
          {() => (
            <AnimatedPageWrapper>
              <ForgotUsername />
            </AnimatedPageWrapper>
          )}
        </Route>
        
        {!isAuthenticated ? (
          <Route path="/">
            {() => (
              <AnimatedPageWrapper>
                <Landing />
              </AnimatedPageWrapper>
            )}
          </Route>
        ) : (
          <>
            <Route path="/">
              {() => (
                <AnimatedPageWrapper>
                  {user?.role === "teacher" ? (
                    <TeacherDashboard />
                  ) : (
                    <Home />
                  )}
                </AnimatedPageWrapper>
              )}
            </Route>
            <Route path="/doctors">
              {() => (
                <AnimatedPageWrapper>
                  <DoctorListing />
                </AnimatedPageWrapper>
              )}
            </Route>
            <Route path="/doctors/:id">
              {() => (
                <AnimatedPageWrapper>
                  <DoctorProfile />
                </AnimatedPageWrapper>
              )}
            </Route>
            <Route path="/compare">
              {() => (
                <AnimatedPageWrapper>
                  <Compare />
                </AnimatedPageWrapper>
              )}
            </Route>
            <Route path="/teacher-dashboard">
              {() => (
                <AnimatedPageWrapper>
                  <TeacherDashboard />
                </AnimatedPageWrapper>
              )}
            </Route>
          </>
        )}
        <Route>
          {() => (
            <AnimatedPageWrapper>
              <NotFound />
            </AnimatedPageWrapper>
          )}
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
