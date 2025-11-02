import type { RoutinePlan, RoutineGoal, RoutineLevel } from "./routines";
import type { UserProfile } from "@/context/UserContext";

export function pickRecommendedRoutines(
  profile: UserProfile | null,
  routines: RoutinePlan[],
) {
  if (!profile) return routines.slice(0, 3);

  return routines
    .filter((routine) => matchesGoal(routine.goal, profile.goal))
    .filter((routine) => matchesLevel(routine.level, profile.level))
    .sort((a, b) => scoreRoutine(profile, b) - scoreRoutine(profile, a))
    .slice(0, 3);
}

function matchesGoal(routineGoal: RoutineGoal, userGoal: UserProfile["goal"]) {
  if (!userGoal) return true;
  if (userGoal === "health") return routineGoal !== "performance";
  if (userGoal === "performance") return routineGoal === "strength" || routineGoal === "performance";
  if (userGoal === "muscle") return routineGoal === "hypertrophy";
  if (userGoal === "fat-loss") return routineGoal === "fat-loss";
  return true;
}

function matchesLevel(routineLevel: RoutineLevel, userLevel: UserProfile["level"]) {
  const order: RoutineLevel[] = ["beginner", "intermediate", "advanced"];
  const routineIndex = order.indexOf(routineLevel);
  const userIndex = order.indexOf(userLevel ?? "beginner");
  return routineIndex <= userIndex + 1;
}

function scoreRoutine(profile: UserProfile, routine: RoutinePlan) {
  let score = 0;

  if (routine.focusAreas.some((area) => profile.focusAreas?.includes(area))) {
    score += 2;
  }

  if (Math.abs(routine.sessionsPerWeek - (profile.weeklyFrequency ?? 3)) <= 1) {
    score += 1;
  }

  return score;
}
