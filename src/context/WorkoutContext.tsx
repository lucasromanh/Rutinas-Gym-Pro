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
}

interface WorkoutContextValue extends WorkoutState {
  selectRoutine: (id: string) => void;
  addCustomWorkout: (workout: Omit<CustomWorkout, "id">) => void;
  logSession: (session: Omit<WorkoutSession, "id">) => void;
  deleteCustomWorkout: (id: string) => void;
}

const defaultState: WorkoutState = {
  routines: baseRoutines,
  customWorkouts: [],
  history: [],
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

  const value = useMemo<WorkoutContextValue>(
    () => ({
      ...state,
      selectRoutine,
      addCustomWorkout,
      deleteCustomWorkout,
      logSession,
    }),
    [state, selectRoutine, addCustomWorkout, deleteCustomWorkout, logSession],
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkouts must be used within WorkoutProvider");
  return ctx;
}
