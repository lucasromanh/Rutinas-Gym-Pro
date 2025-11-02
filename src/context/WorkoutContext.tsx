import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { baseRoutines, type RoutinePlan } from "@/data/routines";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

const STORAGE_KEY = "Rutina:workouts";

export interface WorkoutSession {
  id: string;
  routineId: string;
  date: string;
  perceivedEffort: number;
  durationMinutes: number;
  totalVolume: number;
  notes?: string;
}

export interface CustomWorkout {
  id: string;
  name: string;
  focusAreas: string[];
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    load?: string;
  }>;
}

interface WorkoutState {
  routines: RoutinePlan[];
  selectedRoutineId?: string;
  customWorkouts: CustomWorkout[];
  history: WorkoutSession[];
  // persisted timer state
  timerRunning?: boolean;
  timerVisible?: boolean;
  timerExpanded?: boolean;
  elapsedSeconds?: number;
}

interface WorkoutContextValue extends WorkoutState {
  selectRoutine: (id: string) => void;
  addCustomWorkout: (workout: Omit<CustomWorkout, "id">) => void;
  logSession: (session: Omit<WorkoutSession, "id">) => void;
  deleteCustomWorkout: (id: string) => void;
  // Timer controls (global floating timer)
  timerRunning: boolean;
  timerVisible: boolean;
  timerExpanded: boolean;
  elapsedSeconds: number;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  toggleTimerVisible: () => void;
  toggleTimerExpanded: () => void;
}

const defaultState: WorkoutState = {
  routines: baseRoutines,
  customWorkouts: [],
  history: [],
  timerRunning: false,
  timerVisible: false,
  timerExpanded: false,
  elapsedSeconds: 0,
};

function makeId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkoutState>(() => {
    const persisted = loadFromStorage<WorkoutState>(STORAGE_KEY, defaultState);
    return {
      ...persisted,
      routines: baseRoutines,
    };
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const selectRoutine = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedRoutineId: id }));
  }, []);

  const addCustomWorkout = useCallback((workout: Omit<CustomWorkout, "id">) => {
    setState((prev) => ({
      ...prev,
      customWorkouts: [
        { ...workout, id: makeId() },
        ...prev.customWorkouts,
      ].slice(0, 30),
    }));
  }, []);

  const deleteCustomWorkout = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      customWorkouts: prev.customWorkouts.filter((item) => item.id !== id),
    }));
  }, []);

  const logSession = useCallback((session: Omit<WorkoutSession, "id">) => {
    setState((prev) => ({
      ...prev,
      history: [
        { ...session, id: makeId() },
        ...prev.history,
      ].slice(0, 60),
    }));
  }, []);

  // Timer controls
  const startTimer = useCallback(() => {
    setState((prev) => ({ ...prev, timerRunning: true }));
  }, []);

  const stopTimer = useCallback(() => {
    setState((prev) => ({ ...prev, timerRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({ ...prev, elapsedSeconds: 0, timerRunning: false }));
  }, []);

  const toggleTimerVisible = useCallback(() => {
    setState((prev) => ({ ...prev, timerVisible: !prev.timerVisible }));
  }, []);

  const toggleTimerExpanded = useCallback(() => {
    setState((prev) => ({ ...prev, timerExpanded: !prev.timerExpanded }));
  }, []);

  // keep elapsedSeconds ticking while timerRunning
  useEffect(() => {
    if (!state.timerRunning) return;
    let mounted = true;
    const start = Date.now() - (state.elapsedSeconds ?? 0) * 1000;
    const id = setInterval(() => {
      if (!mounted) return;
      const secs = Math.floor((Date.now() - start) / 1000);
      setState((prev) => ({ ...prev, elapsedSeconds: secs }));
    }, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timerRunning]);

  const value = useMemo<WorkoutContextValue>(
    () => ({
      ...state,
      timerRunning: Boolean(state.timerRunning),
      timerVisible: Boolean(state.timerVisible),
      timerExpanded: Boolean(state.timerExpanded),
      elapsedSeconds: state.elapsedSeconds ?? 0,
      selectRoutine,
      addCustomWorkout,
      deleteCustomWorkout,
      logSession,
      startTimer,
      stopTimer,
      resetTimer,
      toggleTimerVisible,
      toggleTimerExpanded,
    }),
    [state, selectRoutine, addCustomWorkout, deleteCustomWorkout, logSession, startTimer, stopTimer, resetTimer, toggleTimerVisible, toggleTimerExpanded],
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be used within WorkoutProvider");
  return ctx;
}
