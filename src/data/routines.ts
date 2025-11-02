export type RoutineGoal = "fat-loss" | "hypertrophy" | "strength" | "performance";
export type RoutineLevel = "beginner" | "intermediate" | "advanced";

export interface RoutineBlock {
  id: string;
  name: string;
  focusAreas: string[];
  sessionsPerWeek: number;
  durationWeeks: number;
  summary: string;
  workouts: Array<{
    day: string;
    title: string;
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps: string;
      notes?: string;
    }>;
  }>;
}

export interface RoutinePlan extends RoutineBlock {
  goal: RoutineGoal;
  level: RoutineLevel;
  coverImage: string;
}

export const baseRoutines: RoutinePlan[] = [
  {
    id: "lean-start",
    name: "Lean Start",
    goal: "fat-loss",
    level: "beginner",
    focusAreas: ["full-body", "cardio"],
    sessionsPerWeek: 3,
    durationWeeks: 6,
    summary: "Circuitos dinámicos para activar el metabolismo y generar adherencia.",
    coverImage: "/assets/home.svg",
    workouts: [
      {
        day: "Lunes",
        title: "Full Body Booster",
        exercises: [
          { exerciseId: "jumping-jacks", sets: 3, reps: "45s" },
          { exerciseId: "bodyweight-squat", sets: 3, reps: "12" },
          { exerciseId: "push-up-knees", sets: 3, reps: "10" },
          { exerciseId: "plank", sets: 3, reps: "40s" }
        ]
      },
      {
        day: "Miércoles",
        title: "Cardio Core",
        exercises: [
          { exerciseId: "jump-rope", sets: 4, reps: "1 min" },
          { exerciseId: "mountain-climber", sets: 3, reps: "20" },
          { exerciseId: "walking-lunge", sets: 3, reps: "14" },
          { exerciseId: "hollow-hold", sets: 3, reps: "30s" }
        ]
      },
      {
        day: "Viernes",
        title: "Resistencia Total",
        exercises: [
          { exerciseId: "rower", sets: 3, reps: "500m" },
          { exerciseId: "kettlebell-swing", sets: 3, reps: "15" },
          { exerciseId: "incline-walk", sets: 3, reps: "5 min" },
          { exerciseId: "side-plank", sets: 3, reps: "30s" }
        ]
      }
    ]
  },
  {
    id: "power-hypertrophy",
    name: "Power Hypertrophy",
    goal: "hypertrophy",
    level: "intermediate",
    focusAreas: ["upper-body", "legs"],
    sessionsPerWeek: 5,
    durationWeeks: 8,
    summary: "Rutina push/pull/legs con enfoque en progresión de cargas.",
    coverImage: "/assets/crear.svg",
    workouts: [
      {
        day: "Lunes",
        title: "Push Fuerza",
        exercises: [
          { exerciseId: "barbell-bench-press", sets: 4, reps: "5" },
          { exerciseId: "incline-dumbbell-press", sets: 3, reps: "10" },
          { exerciseId: "overhead-press", sets: 3, reps: "8" },
          { exerciseId: "rope-pushdown", sets: 3, reps: "12" }
        ]
      },
      {
        day: "Martes",
        title: "Pull Dorsal",
        exercises: [
          { exerciseId: "deadlift", sets: 4, reps: "5" },
          { exerciseId: "weighted-pull-up", sets: 4, reps: "6" },
          { exerciseId: "single-arm-row", sets: 3, reps: "12" },
          { exerciseId: "face-pull", sets: 3, reps: "15" }
        ]
      },
      {
        day: "Jueves",
        title: "Piernas Enfocadas",
        exercises: [
          { exerciseId: "back-squat", sets: 4, reps: "6" },
          { exerciseId: "romanian-deadlift", sets: 3, reps: "10" },
          { exerciseId: "leg-press", sets: 3, reps: "12" },
          { exerciseId: "leg-extension", sets: 3, reps: "15" }
        ]
      },
      {
        day: "Viernes",
        title: "Push Volumen",
        exercises: [
          { exerciseId: "dumbbell-shoulder-press", sets: 4, reps: "10" },
          { exerciseId: "cable-fly", sets: 3, reps: "15" },
          { exerciseId: "lateral-raise", sets: 4, reps: "15" },
          { exerciseId: "tricep-dip", sets: 3, reps: "10" }
        ]
      },
      {
        day: "Sábado",
        title: "Pull Detalles",
        exercises: [
          { exerciseId: "seated-cable-row", sets: 4, reps: "12" },
          { exerciseId: "lat-pulldown", sets: 4, reps: "10" },
          { exerciseId: "rear-delt-fly", sets: 3, reps: "15" },
          { exerciseId: "ez-bar-curl", sets: 3, reps: "12" }
        ]
      }
    ]
  },
  {
    id: "elite-strength",
    name: "Elite Strength",
    goal: "strength",
    level: "advanced",
    focusAreas: ["powerlifting", "core"],
    sessionsPerWeek: 4,
    durationWeeks: 12,
    summary: "Plan periodizado enfocado en el desarrollo máximo de fuerza.",
    coverImage: "/assets/info.svg",
    workouts: [
      {
        day: "Lunes",
        title: "Fuerza Máxima",
        exercises: [
          { exerciseId: "back-squat", sets: 5, reps: "3" },
          { exerciseId: "paused-bench-press", sets: 5, reps: "3" },
          { exerciseId: "deadlift", sets: 3, reps: "3" }
        ]
      },
      {
        day: "Miércoles",
        title: "Fuerza Dinámica",
        exercises: [
          { exerciseId: "speed-squat", sets: 6, reps: "2" },
          { exerciseId: "push-press", sets: 5, reps: "3" },
          { exerciseId: "deficit-deadlift", sets: 4, reps: "4" }
        ]
      },
      {
        day: "Viernes",
        title: "Técnica Bench",
        exercises: [
          { exerciseId: "bench-press", sets: 5, reps: "3" },
          { exerciseId: "close-grip-bench", sets: 4, reps: "5" },
          { exerciseId: "weighted-chin-up", sets: 4, reps: "6" }
        ]
      },
      {
        day: "Sábado",
        title: "Accesorios",
        exercises: [
          { exerciseId: "reverse-hyper", sets: 4, reps: "12" },
          { exerciseId: "glute-bridge", sets: 4, reps: "15" },
          { exerciseId: "farmer-carry", sets: 5, reps: "40m" }
        ]
      }
    ]
  }
];
