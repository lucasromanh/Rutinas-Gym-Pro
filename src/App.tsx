import { Navigate, Route, Routes } from "react-router-dom";

import OnboardingPage from "@/pages/Onboarding";
import HomePage from "@/pages/HomePage";
import ProgramPage from "@/pages/ProgramPage";
import WorkoutsPage from "@/pages/WorkoutsPage";
import WorkoutDetail from "@/pages/WorkoutDetail";
import StatsPage from "@/pages/StatsPage";
import CustomWorkoutsPage from "@/pages/CustomWorkoutsPage";
import ExerciseLibrary from "@/pages/ExerciseLibrary";
import PremiumPage from "@/pages/PremiumPage";
import MorePage from "@/pages/MorePage";
import { AppShell } from "@/components/layout/AppShell";
import { useUser } from "@/context/UserContext";

export default function App() {
  return <AppRoutes />;
}

function AppRoutes() {
  const { profile } = useUser();
  const onboardingComplete = profile?.onboardingComplete;

  return (
    <Routes>
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route element={<AppShell />}>
        <Route
          index
          element={
            onboardingComplete ? <HomePage /> : <Navigate to="/onboarding" replace />
          }
        />
        <Route path="/programs" element={<ProgramPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/workouts/:routineId" element={<WorkoutDetail />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/custom" element={<CustomWorkoutsPage />} />
        <Route path="/library" element={<ExerciseLibrary />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
