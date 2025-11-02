import { CalendarDays, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { ThemeToggle } from "./ThemeToggle";

const titles: Record<string, string> = {
  "/": "Inicio",
  "/programs": "Programas",
  "/stats": "Informe",
  "/workouts": "Entrenamientos",
  "/more": "Más",
  "/custom": "Rutinas Personalizadas",
  "/library": "Biblioteca",
  "/premium": "Zona Premium",
};

export function Header() {
  const { profile } = useUser();
  const location = useLocation();
  const title = titles[location.pathname] ?? "Rutina Gym Pro";

  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Hola {profile?.name ?? "Atleta"}</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        </div>
        <ThemeToggle />
      </div>
      <motion.div
        className="flex flex-wrap gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {profile?.goal && (
          <Badge variant="default" className="gap-1">
            <Flame className="h-3.5 w-3.5" /> Objetivo: {goalLabel(profile.goal)}
          </Badge>
        )}
        {profile?.weeklyFrequency && (
          <Badge variant="outline" className="gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {profile.weeklyFrequency} sesiones/semana
          </Badge>
        )}
      </motion.div>
    </header>
  );
}

function goalLabel(goal: string) {
  switch (goal) {
    case "fat-loss":
      return "Pérdida de grasa";
    case "muscle":
      return "Hipertrofia";
    case "performance":
      return "Rendimiento";
    default:
      return "Salud";
  }
}
