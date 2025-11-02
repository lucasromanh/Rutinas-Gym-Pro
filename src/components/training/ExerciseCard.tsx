import { Dumbbell, Pencil } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: string;
  muscle?: string;
  image?: string;
  note?: string;
  highlight?: boolean;
  onClick?: () => void;
}

export function ExerciseCard({ name, sets, reps, muscle, image, note, highlight, onClick }: ExerciseCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card
        onClick={onClick}
        className={cn(
          "cursor-pointer border border-transparent bg-white transition hover:border-indigo-200 dark:bg-slate-900 dark:hover:border-indigo-500/40",
          highlight && "border-indigo-300 bg-indigo-50/80 dark:border-indigo-500/60 dark:bg-indigo-500/10",
        )}
      >
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {image ? (
              <img src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Dumbbell className="h-5 w-5" />
              </div>
            )}
            <div>
              <CardTitle className="text-base text-slate-700 dark:text-slate-100">{name}</CardTitle>
              {muscle && <p className="text-xs text-slate-400 dark:text-slate-400">{muscle}</p>}
            </div>
          </div>
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
            {sets} x {reps}
            <Pencil className="h-4 w-4" />
          </span>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={cn("h-full rounded-full bg-indigo-500", highlight ? "w-4/5" : "w-3/4")} />
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-slate-400 dark:text-slate-500">
          {note ? <span className="line-clamp-2 text-left">Nota: {note}</span> : "Toca para editar"}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
