import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import exerciseData from "@/data/exercises.json";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const muscleFilters = ["chest", "legs", "lats", "shoulders", "core", "posterior-chain", "full-body"];

export default function ExerciseLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [muscle, setMuscle] = useState<string>("all");

  const filtered = useMemo(() => {
    return exerciseData.filter((exercise) => {
      const matchesText = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMuscle = muscle === "all" || exercise.primaryMuscle === muscle;
      return matchesText && matchesMuscle;
    });
  }, [searchTerm, muscle]);

  return (
    <div className="space-y-6 pb-20">
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-xl font-semibold">Biblioteca de ejercicios</h2>
        <p className="text-sm text-slate-500">Más de 60 ejercicios listos para añadir a tus rutinas.</p>
        <div className="mt-4 flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-2 dark:bg-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nombre"
            className="h-10 flex-1 rounded-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge
            variant={muscle === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setMuscle("all")}
          >
            Todos
          </Badge>
          {muscleFilters.map((option) => (
            <Badge
              key={option}
              variant={muscle === option ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setMuscle(option)}
            >
              {option}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((exercise) => (
          <Card key={exercise.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-500">
              <p>Categoría: {exercise.category}</p>
              <p>Músculo principal: {exercise.primaryMuscle}</p>
              <p>Equipo: {exercise.equipment}</p>
              <p>Nivel: {exercise.level}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
