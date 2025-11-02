import { BarChart3, Dumbbell, Home, MoreHorizontal } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/workouts", label: "Entrenos", icon: Dumbbell },
  { to: "/stats", label: "Informe", icon: BarChart3 },
  { to: "/more", label: "Más", icon: MoreHorizontal },
];

export function BottomTabs() {
  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[94%] max-w-xl">
      <div className="glass-panel flex items-center justify-around rounded-full bg-white/90 px-4 py-2 shadow-lg dark:bg-slate-900/80">
        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition",
                isActive
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
