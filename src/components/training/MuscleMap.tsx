import { cn } from "@/lib/utils";

const muscularRegions = [
  { id: "chest", label: "Pectorales", position: "top-16" },
  { id: "shoulders", label: "Hombros", position: "top-8" },
  { id: "arms", label: "Brazos", position: "top-24" },
  { id: "core", label: "Core", position: "top-32" },
  { id: "legs", label: "Piernas", position: "top-48" },
  { id: "lats", label: "Dorsales", position: "top-20" },
  { id: "posterior-chain", label: "Cadena Posterior", position: "top-40" },
];

interface MuscleMapProps {
  highlight?: string[];
}

export function MuscleMap({ highlight = [] }: MuscleMapProps) {
  return (
    <div className="relative mx-auto flex h-80 w-48 items-center justify-center">
      <div className="absolute inset-0 rounded-[40%] bg-gradient-to-b from-indigo-100 via-white to-indigo-50 shadow-inner" />
      {muscularRegions.map((muscle) => (
        <div
          key={muscle.id}
          className={cn(
            "absolute w-24 rounded-full px-3 py-1 text-center text-xs font-semibold uppercase",
            "bg-white/80 text-slate-500 shadow-sm backdrop-blur",
            highlight.includes(muscle.id)
              ? "border border-indigo-200 text-indigo-600"
              : "border border-slate-200",
            muscle.position,
          )}
        >
          {muscle.label}
        </div>
      ))}
      <div className="absolute h-72 w-24 origin-bottom rounded-full bg-gradient-to-b from-indigo-200 via-indigo-300/60 to-indigo-400/40 opacity-50" />
      <div className="absolute bottom-6 h-20 w-20 rounded-full border-4 border-indigo-200 bg-white shadow-md" />
    </div>
  );
}
