import { useMemo } from "react";
import { ArrowRightCircle, Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import homeArt from "@/assets/home.svg";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MetricCard, ProgressRing } from "@/components/charts/ProgressRing";
import { useUser } from "@/context/UserContext";
import { useWorkouts, type WorkoutSession } from "@/context/WorkoutContext";
import { pickRecommendedRoutines } from "@/data/selector";

export default function HomePage() {
  const { profile, bmi, bmiLabel } = useUser();
  const { routines, history, selectedRoutineId } = useWorkouts();
  const activeRoutine = routines.find((item) => item.id === selectedRoutineId);

  const recommended = useMemo(() => pickRecommendedRoutines(profile, routines), [profile, routines]);
  const totalVolume = history.slice(0, 5).reduce((acc, session) => acc + (session.totalVolume ?? 0), 0);
  const weeklySessions = history.filter((session) => isThisWeek(session.date)).length;

  return (
    <div className="space-y-6 pb-10">
      <Card className="bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600 text-white">
        <CardHeader className="flex flex-col gap-4 pb-0">
          <div className="flex items-center gap-4">
            <img src={homeArt} alt="Rutina" className="h-16 w-16 rounded-3xl bg-white/10 p-2" />
            <div>
              <CardTitle className="text-xl font-semibold">Rutina Gym Pro</CardTitle>
              <CardDescription className="text-indigo-100">
                Domina tu entrenamiento con datos claros y rutinas inteligentes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <ProgressRing value={Math.min((weeklySessions / (profile?.weeklyFrequency ?? 3)) * 100, 100)} label="Cumplimiento semanal" />
          <MetricCard
            title="IMC"
            value={bmi ? bmi.toString() : "-"}
            highlight={bmiLabel}
            helper="Mantén tus progresos actualizando el peso cada semana."
            className="bg-white backdrop-blur dark:bg-slate-800"
          />
          <MetricCard
            title="Volumen reciente"
            value={`${totalVolume.toLocaleString()} kg`}
            helper="Promedio de tus últimas 5 sesiones registradas."
            className="bg-white backdrop-blur dark:bg-slate-800"
          />
        </CardContent>
      </Card>

      <section className="space-y-4">
        {activeRoutine && (
          <Link
            to={`/workouts/${activeRoutine.id}`}
            className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 hover:shadow-md transition-shadow dark:bg-slate-900 dark:ring-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 dark:text-slate-200">Rutina activa</div>
                <div className="text-base font-semibold text-slate-800 dark:text-slate-100">{activeRoutine.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-200">{activeRoutine.sessionsPerWeek} sesiones/semana</div>
              </div>
              <div>
                <img src={activeRoutine.coverImage} alt={activeRoutine.name} className="h-12 w-12 rounded-lg object-cover" />
              </div>
            </div>
          </Link>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Rutinas recomendadas</h2>
          <Button variant="ghost" size="sm" className="text-indigo-600" asChild>
            <Link to="/programs">Ver todas</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recommended.map((routine) => (
            <motion.div key={routine.id} whileHover={{ scale: 1.02 }}>
              <Card className="overflow-hidden">
                <CardHeader className="flex items-center gap-4">
                  <img src={routine.coverImage} alt={routine.name} className="h-16 w-16 rounded-2xl object-cover" />
                  <div>
                    <CardTitle>{routine.name}</CardTitle>
                    <CardDescription>
                      {routine.sessionsPerWeek} días • {routine.durationWeeks} semanas
                    </CardDescription>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge variant="default">{routine.goal}</Badge>
                          <Badge variant="outline">{routine.level}</Badge>
                        </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <p className="text-sm text-slate-500 dark:text-slate-200">{routine.summary}</p>
                  <Button variant="primary" size="sm" asChild>
                    <Link to={`/workouts/${routine.id}`} className="flex items-center gap-2">
                      Ver
                      <ArrowRightCircle className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Seguimiento rápido</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Flame className="h-4 w-4 text-amber-500" /> Cumplimiento semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min((weeklySessions / (profile?.weeklyFrequency ?? 3)) * 100, 100)} />
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-200">
                {weeklySessions} de {profile?.weeklyFrequency ?? 3} sesiones completadas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-indigo-500" /> Racha activa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold dark:text-slate-100">{calculateStreak(history)} días</p>
              <p className="text-xs text-slate-400 dark:text-slate-200">Mantén el ritmo para desbloquear logros premium.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <ArrowRightCircle className="h-4 w-4 text-emerald-500" /> Último registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length ? (
                <p className="text-sm text-slate-500 dark:text-slate-200">
                  {new Date(history[0].date).toLocaleDateString()} · {history[0].durationMinutes} min · {" "}
                  {history[0].totalVolume.toLocaleString()} kg
                </p>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-200">Aún no registraste tus entrenamientos.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function isThisWeek(dateISO: string) {
  const date = new Date(dateISO);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return date >= startOfWeek;
}

function calculateStreak(history: WorkoutSession[]) {
  let streak = 0;
  const ordered = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const session of ordered) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    if (Math.abs(cursor.getTime() - sessionDate.getTime()) <= 24 * 60 * 60 * 1000) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else if (sessionDate.getTime() < cursor.getTime()) {
      break;
    }
  }
  return streak;
}
