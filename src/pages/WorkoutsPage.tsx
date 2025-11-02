import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import workoutsArt from "@/assets/crear.svg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { useWorkouts, type WorkoutSession } from "@/context/WorkoutContext";

const defaultSession: Omit<WorkoutSession, "id"> = {
  routineId: "custom",
  date: new Date().toISOString(),
  perceivedEffort: 7,
  durationMinutes: 60,
  totalVolume: 5000,
};

export default function WorkoutsPage() {
  const { profile, logProgress } = useUser();
  const { routines, selectedRoutineId, history, logSession } = useWorkouts();
  const [session, setSession] = useState(defaultSession);
  const activeRoutine = routines.find((item) => item.id === selectedRoutineId);
  const [sessionNotes, setSessionNotes] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    logSession(session);
    logProgress({
      weight: profile?.weight,
      totalVolume: session.totalVolume,
      durationMinutes: session.durationMinutes,
      notes: sessionNotes,
    });
    setSession({ ...defaultSession, date: new Date().toISOString() });
    setSessionNotes("");
  };

  return (
    <div className="space-y-6 pb-20">
      <Card className="border-none bg-gradient-to-br from-indigo-500/10 to-indigo-100 text-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <CardHeader className="flex items-center gap-4">
          <img src={workoutsArt} alt="Entrenamientos" className="h-16 w-16 rounded-2xl" />
          <div>
            <CardTitle className="text-lg text-slate-700 dark:text-slate-100">Tu rutina activa</CardTitle>
            {activeRoutine ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {activeRoutine.name} · {activeRoutine.sessionsPerWeek} sesiones semanales
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-300">Selecciona una rutina para empezar.</p>
            )}
          </div>
        </CardHeader>
        <CardFooter className="justify-end gap-3">
          <Button variant="ghost" asChild>
            <Link to="/programs">Ver programas</Link>
          </Button>
          {activeRoutine && (
            <Button asChild>
              <Link to={`/workouts/${activeRoutine.id}`}>Ver detalle</Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="dark:border-slate-800 dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-base text-slate-700 dark:text-slate-100">Registrar entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500">Rutina</label>
              <select
                className="mt-1 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                value={session.routineId}
                onChange={(event) => setSession((prev) => ({ ...prev, routineId: event.target.value }))}
              >
                <option value="custom">Sesión suelta</option>
                {routines.map((routine) => (
                  <option key={routine.id} value={routine.id}>
                    {routine.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              type="date"
              value={session.date.slice(0, 10)}
              onChange={(event) =>
                setSession((prev) => ({ ...prev, date: new Date(event.target.value).toISOString() }))
              }
            />
            <Input
              type="number"
              placeholder="Duración (min)"
              value={session.durationMinutes}
              onChange={(event) => setSession((prev) => ({ ...prev, durationMinutes: Number(event.target.value) }))}
            />
            <Input
              type="number"
              placeholder="Volumen total (kg)"
              value={session.totalVolume}
              onChange={(event) => setSession((prev) => ({ ...prev, totalVolume: Number(event.target.value) }))}
            />
            <Input
              type="number"
              placeholder="Esfuerzo percibido (1-10)"
              value={session.perceivedEffort}
              onChange={(event) => setSession((prev) => ({ ...prev, perceivedEffort: Number(event.target.value) }))}
            />
            <Textarea
              className="sm:col-span-2"
              placeholder="Notas del día, sensaciones, PRs..."
              value={sessionNotes}
              onChange={(event) => setSessionNotes(event.target.value)}
            />
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit">Guardar sesión</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Historial reciente</h2>
        {history.slice(0, 5).map((entry) => (
          <Card key={entry.id} className="dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-100">
                <span>{new Date(entry.date).toLocaleDateString()}</span>
                <span className="text-xs uppercase text-indigo-600 dark:text-indigo-300">{entry.totalVolume.toLocaleString()} kg</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{entry.durationMinutes} min</span>
              <span>Esfuerzo: {entry.perceivedEffort}/10</span>
            </CardContent>
          </Card>
        ))}
        {!history.length && <p className="text-sm text-slate-400 dark:text-slate-500">Sin registros todavía.</p>}
      </div>
    </div>
  );
}
