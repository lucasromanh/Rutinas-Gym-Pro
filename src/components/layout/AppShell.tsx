import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomTabs } from "./BottomTabs";
import TimerFloating from "@/components/training/TimerFloating";

const onboardingPaths = ["/onboarding"];

export function AppShell() {
  const location = useLocation();
  const hideTabs = onboardingPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-brand-light pb-24 pt-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-[94%] max-w-xl space-y-6">
        {!hideTabs && <Header />}
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="space-y-6"
        >
          <Outlet />
        </motion.main>
        {!hideTabs && <Footer />}
      </div>
      {!hideTabs && <BottomTabs />}
      <TimerFloating />
    </div>
  );
}
