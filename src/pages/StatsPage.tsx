import { Flame, TrendingUp } from "lucide-react";
import statsArt from "@/assets/info.svg";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MetricCard, ProgressRing } from "@/components/charts/ProgressRing";
import { WeeklyVolumeChart } from "@/components/charts/WeeklyVolumeChart";
import { useUser } from "@/context/UserContext";
import { useWorkouts, type WorkoutSession } from "@/context/WorkoutContext";

export default function StatsPage() {
  const { profile, bmi, bmiLabel, progress } = useUser();
  const { history } = useWorkouts();
  const weekData = aggregateWeeklyVolume(history);
  const averageDuration = Math.round(
    history.reduce((acc, session) => acc + (session.durationMinutes ?? 0), 0) /
      (history.length || 1),
  );

  return (
    <div className="space-y-6 pb-16">
  <Card className="flex flex-col gap-4 border-none shadow-none dark:bg-slate-950">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-indigo-50 p-6 dark:bg-indigo-500/10">
          <img src={statsArt} alt="Stats" className="h-16 w-16 rounded-2xl" />
          <div className="space-y-1">
            <p className="text-sm text-indigo-500">Resumen de progreso</p>
            <h2 className="text-xl font-semibold">Hola {profile?.name ?? "atleta"}, ¡vamos fuerte!</h2>
            <p className="text-sm text-slate-500">Última sesión registrada hace {daysSinceLastWorkout(history)} días.</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="IMC actual"
          value={bmi ? bmi.toString() : "-"}
          highlight={bmiLabel}
          helper="Actualiza tu peso desde Inicio > Seguimiento"
        />
        <MetricCard
          title="Duración media"
          value={`${averageDuration} min`}
          helper="Promedio de las sesiones registradas"
        />
        <MetricCard
          title="Sesiones registradas"
          value={history.length.toString()}
          helper="Mantén tu racha registrando cada entrenamiento"
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-indigo-500" /> Carga semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyVolumeChart data={weekData} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Flame className="h-5 w-5 text-amber-500" /> Frecuencia semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressRing
              value={Math.min(
                (history.filter((session) => isThisWeek(session.date)).length /
                  (profile?.weeklyFrequency ?? 3)) *
                  100,
                100,
              )}
              label="Objetivo semanal"
            />
            <Progress value={Math.min((progress.length / 8) * 100, 100)} />
            <p className="text-xs text-slate-900 dark:text-slate-100">
              Has registrado {progress.length} entradas de progreso. Mantén tu consistencia.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notas recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-500">
            {progress.slice(0, 4).map((entry) => (
              <div key={entry.id} className="rounded-2xl bg-slate-100 p-3 dark:bg-slate-800">
                <p className="text-xs uppercase text-slate-900 dark:text-slate-100">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                <p className="mt-1 font-medium">Peso: {entry.weight ?? "-"} kg</p>
                {entry.notes && <p className="text-xs">{entry.notes}</p>}
              </div>
            ))}
            {!progress.length && <p>No registraste progresos todavía.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function aggregateWeeklyVolume(history: WorkoutSession[]) {
  const byWeek = new Map<string, number>();
  history.forEach((session) => {
    const date = new Date(session.date);
    const weekLabel = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    byWeek.set(weekLabel, (byWeek.get(weekLabel) ?? 0) + (session.totalVolume ?? 0));
  });

  return Array.from(byWeek.entries())
    .slice(-6)
    .map(([key, volume]) => ({ week: key, volume }));
}

function getWeekNumber(date: Date) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  return Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function daysSinceLastWorkout(history: WorkoutSession[]) {
  if (!history.length) return "más de 7";
  const last = new Date(history[0].date);
  const diff = Math.round((Date.now() - last.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function isThisWeek(dateISO: string) {
  const date = new Date(dateISO);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}
