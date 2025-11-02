import { Link } from "react-router-dom";
import programArt from "@/assets/crear.svg";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkouts } from "@/context/WorkoutContext";

export default function ProgramPage() {
  const { routines } = useWorkouts();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <img src={programArt} alt="Programas" className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <h2 className="text-xl font-semibold">Explora programas</h2>
          <p className="text-sm text-slate-500">
            Selecciona un plan según tu objetivo y nivel. Todos están listos para editarse a tu gusto.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {routines.map((routine) => (
          <Card key={routine.id} className="overflow-hidden">
            <CardHeader className="flex items-start gap-4">
              <img src={routine.coverImage} alt={routine.name} className="h-20 w-20 rounded-2xl object-cover" />
              <div className="space-y-2">
                <CardTitle>{routine.name}</CardTitle>
                <CardDescription>{routine.summary}</CardDescription>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase text-indigo-600">
                  <Badge variant="default">{routine.goal}</Badge>
                  <Badge variant="outline">{routine.level}</Badge>
                  <Badge variant="outline">{routine.sessionsPerWeek}x semana</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
              <div className="text-sm text-slate-500">
                <p>Duración: {routine.durationWeeks} semanas</p>
                <p>Zonas clave: {routine.focusAreas.join(", ")}</p>
              </div>
              <Button asChild>
                <Link to={`/workouts/${routine.id}`}>Ver detalle</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
