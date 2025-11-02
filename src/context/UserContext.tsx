import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calculateBMI } from "@/utils/bmi";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

const STORAGE_KEY = "Rutina:user";

export type UserGoal = "health" | "fat-loss" | "muscle" | "performance";
export type UserLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  name?: string;
  age?: number;
  height?: number;
  weight?: number;
  goal?: UserGoal;
  level?: UserLevel;
  focusAreas?: string[];
  weeklyFrequency?: number;
  primaryGym?: string;
  onboardingComplete?: boolean;
  oneRm?: Record<string, number>;
}

export interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  totalVolume?: number;
  durationMinutes?: number;
  notes?: string;
}

interface UserContextValue {
  profile: UserProfile | null;
  progress: ProgressEntry[];
  bmi: number;
  bmiLabel: string;
  setProfile: (profile: UserProfile) => void;
  completeOnboarding: (profile: UserProfile) => void;
  logProgress: (entry: Omit<ProgressEntry, "id" | "date"> & { date?: string }) => void;
  updateWeight: (weight: number) => void;
  resetProfile: () => void;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const defaultState: { profile: UserProfile | null; progress: ProgressEntry[] } = {
  profile: null,
  progress: [],
};

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(() => loadFromStorage(STORAGE_KEY, defaultState));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const setProfile = useCallback((profile: UserProfile) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...profile } }));
  }, []);

  const completeOnboarding = useCallback((profile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profile,
        onboardingComplete: true,
      },
    }));
  }, []);

  const logProgress = useCallback(
    (entry: Omit<ProgressEntry, "id" | "date"> & { date?: string }) => {
      setState((prev) => ({
        ...prev,
        progress: [
          {
            id: makeId(),
            date: entry.date ?? new Date().toISOString(),
            weight: entry.weight,
            totalVolume: entry.totalVolume,
            durationMinutes: entry.durationMinutes,
            notes: entry.notes,
          },
          ...prev.progress,
        ].slice(0, 50),
      }));
    },
    [],
  );

  const updateWeight = useCallback((weight: number) => {
    setState((prev) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, weight } : prev.profile,
    }));
  }, []);

  const resetProfile = useCallback(() => {
    setState(defaultState);
  }, []);

  const bmi = useMemo(() => {
    if (!state.profile?.weight || !state.profile?.height) return 0;
    return calculateBMI(state.profile.weight, state.profile.height);
  }, [state.profile?.height, state.profile?.weight]);

  const bmiLabel = useMemo(() => {
    if (!bmi) return "Sin datos";
    if (bmi < 18.5) return "Bajo peso";
    if (bmi < 24.9) return "Saludable";
    if (bmi < 29.9) return "Sobrepeso";
    return "Obesidad";
  }, [bmi]);

  const value = useMemo<UserContextValue>(
    () => ({
      profile: state.profile,
      progress: state.progress,
      bmi,
      bmiLabel,
      setProfile,
      completeOnboarding,
      logProgress,
      updateWeight,
      resetProfile,
    }),
    [state.profile, state.progress, bmi, bmiLabel, setProfile, completeOnboarding, logProgress, updateWeight, resetProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
