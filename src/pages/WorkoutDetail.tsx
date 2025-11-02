import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toast } from "@/components/ui/Toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { useWorkouts } from "@/context/WorkoutContext";
import { loadFromStorage, saveToStorage } from "@/utils/storage";
import exerciseData from "@/data/exercises.json";
import type { RoutinePlan } from "@/data/routines";

interface ExerciseOverride {
  sets: number;
  reps: string;
  note?: string;
}

type RoutineExercise = RoutinePlan["workouts"][number]["exercises"][number];

interface EditorValues {
  sets: string;
  reps: string;
  note: string;
}

interface EditorSelection {
  key: string;
  name: string;
  muscle?: string;
  image?: string;
  defaultSets: number;
  defaultReps: string;
  defaultNote?: string;
}

export default function WorkoutDetail() {
  const { routineId } = useParams();
  const navigate = useNavigate();
  const { routines, selectRoutine, selectedRoutineId, startTimer, toggleTimerVisible, timerRunning, logSession, history, removeHistoryEntryById } = useWorkouts();
  const routine = useMemo(() => routines.find((item) => item.id === routineId), [routineId, routines]);
  const exerciseLookup = useMemo(() => new Map(exerciseData.map((exercise) => [exercise.id, exercise])), []);
  const storageKey = routine ? `RoutineOverrides:${routine.id}` : undefined;
  const [overrides, setOverrides] = useState<Record<string, ExerciseOverride>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editorSelection, setEditorSelection] = useState<EditorSelection | null>(null);
  const [editorValues, setEditorValues] = useState<EditorValues>({ sets: "", reps: "", note: "" });

  useEffect(() => {
    if (!storageKey) return;
    const stored = loadFromStorage<Record<string, ExerciseOverride>>(storageKey, {});
    setOverrides(stored);
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    saveToStorage(storageKey, overrides);
  }, [storageKey, overrides]);

  const handleDialogToggle = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditorSelection(null);
    }
  };

  if (!routine) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Rutina no encontrada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-900 dark:text-slate-100">
              La rutina que buscabas no existe o fue removida. Vuelve a la lista y selecciona otra opción.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSelected = selectedRoutineId === routine.id;

  function getDateForWeekday(spanishDay: string) {
    const map: Record<string, number> = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miércoles: 3,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sábado: 6,
      sabado: 6,
    };
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const idx = map[spanishDay.toLowerCase() as keyof typeof map] ?? 1;
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return d;
  }

  function formatISODateOnly(date: string | Date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().slice(0, 10);
  }

  function isWorkoutDoneForDay(day: string) {
    if (!history || !routine) return false;
    const target = formatISODateOnly(getDateForWeekday(day));
    return history.some((h) => h.routineId === routine.id && formatISODateOnly(h.date) === target);
  }

  const markWorkoutDone = (day: string, workoutTitle: string) => {
    const iso = getDateISOForDay(day);
    const targetDate = getDateForWeekday(day);
    // estimate duration: 8 minutes per exercise
    const block = routine.workouts.find((w) => w.day === day);
    const durationMinutes = (block?.exercises.length ?? 0) * 8 || 30;

    // gather which exercises were marked as done for that date (from RoutineProgress)
    const progress = loadProgress();
    const doneIds = new Set(progress[iso] ?? []);
    const performed = (block?.exercises ?? []).map((ex) => ({
      exerciseId: ex.exerciseId,
      name: exerciseLookup.get(ex.exerciseId)?.name,
      sets: ex.sets,
      reps: ex.reps,
    })).filter((p) => doneIds.has(p.exerciseId));

    const session = {
      routineId: routine.id,
      date: targetDate.toISOString(),
      perceivedEffort: 7,
      durationMinutes,
      totalVolume: 0,
      notes: `Marcado como hecho: ${workoutTitle}`,
      performedExercises: performed,
    } as const;

    const sessionId = logSession(session);

    // clear per-exercise progress for that date (we already logged the session)
    const performedIds = Array.from(doneIds);
    if (progress[iso]) {
      delete progress[iso];
      saveProgress(progress);
    }

    // prepare undo info (user can undo shortly after marking)
    setUndoInfo({ sessionId, iso, performedIds });

    // show toast with undo action
    setToast("Día marcado como completado");
  };

  const unmarkWorkoutDone = (day: string) => {
    const target = formatISODateOnly(getDateForWeekday(day));
    // remove any history entry for this routineId on that date via context helper
    const toRemove = history.filter((h) => h.routineId === routine.id && formatISODateOnly(h.date) === target);
    toRemove.forEach((s) => removeHistoryEntryById(s.id));
    showToast("Registro eliminado");
  };

  // Persist progress per-exercise for the routine, keyed by ISO date
  function progressStorageKey() {
    return routine ? `RoutineProgress:${routine.id}` : undefined;
  }

  function loadProgress(): Record<string, string[]> {
    const key = progressStorageKey();
    if (!key) return {};
    return loadFromStorage<Record<string, string[]>>(key, {});
  }

  function saveProgress(data: Record<string, string[]>) {
    const key = progressStorageKey();
    if (!key) return;
    saveToStorage(key, data);
  }

  function getDateISOForDay(day: string) {
    return formatISODateOnly(getDateForWeekday(day));
  }

  function isExerciseDone(day: string, exerciseId: string) {
    const iso = getDateISOForDay(day);
    const progress = loadProgress();
    const list = progress[iso] ?? [];
    return list.includes(exerciseId);
  }

  function toggleExerciseDone(day: string, exerciseId: string) {
    const iso = getDateISOForDay(day);
    const progress = loadProgress();
    const list = new Set(progress[iso] ?? []);
    if (list.has(exerciseId)) {
      list.delete(exerciseId);
    } else {
      list.add(exerciseId);
    }
    progress[iso] = Array.from(list);
    saveProgress(progress);

    // If by toggling we reached all exercises done for that day, we *show* the mark-day button.
    // We don't auto-log the session; user must press "Marcar día completo" to record the session.
  // UI will update via state changes and toast feedback.
    // feedback
    showToast(list.has(exerciseId) ? "Ejercicio marcado" : "Ejercicio desmarcado");
  }

  const [toast, setToast] = useState<string | null>(null);
  const [undoInfo, setUndoInfo] = useState<null | { sessionId: string; iso: string; performedIds: string[] }>(null);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => {
      setToast(null);
      setUndoInfo(null);
    }, 2800);
    return () => clearTimeout(id);
  }, [toast]);


  function showToast(message: string) {
    setToast(message);
  }

  function handleUndo() {
    if (!undoInfo) return;
    // remove session from history
    removeHistoryEntryById(undoInfo.sessionId);
    // restore progress
    const progress = loadProgress();
    progress[undoInfo.iso] = undoInfo.performedIds;
    saveProgress(progress);
    setUndoInfo(null);
    showToast("Acción deshecha");
  }

  const openEditor = (day: string, exercise: RoutineExercise) => {
    const key = `${day}:${exercise.exerciseId}`;
    const info = exerciseLookup.get(exercise.exerciseId);
    const override = overrides[key];

    setEditorSelection({
      key,
      name: info?.name ?? exercise.exerciseId,
      muscle: info?.primaryMuscle,
      image: info?.image,
      defaultSets: exercise.sets,
      defaultReps: exercise.reps,
      defaultNote: exercise.notes,
    });

    setEditorValues({
      sets: String(override?.sets ?? exercise.sets),
      reps: override?.reps ?? exercise.reps,
      note: override?.note ?? exercise.notes ?? "",
    });

    handleDialogToggle(true);
  };

  const handleSave = () => {
    if (!editorSelection) return;

    const parsedSets = Number.parseInt(editorValues.sets, 10);
    const safeSets = Number.isFinite(parsedSets) && parsedSets > 0 ? parsedSets : editorSelection.defaultSets;
    const safeReps = editorValues.reps.trim() || editorSelection.defaultReps;
    const normalizedNote = editorValues.note.trim();
    const defaultNote = editorSelection.defaultNote ?? "";

    if (safeSets === editorSelection.defaultSets && safeReps === editorSelection.defaultReps && normalizedNote === defaultNote) {
      setOverrides((prev) => {
        const next = { ...prev };
        delete next[editorSelection.key];
        return next;
      });
    } else {
      setOverrides((prev) => ({
        ...prev,
        [editorSelection.key]: {
          sets: safeSets,
          reps: safeReps,
          note: normalizedNote || undefined,
        },
      }));
    }

    handleDialogToggle(false);
  };

  const handleReset = () => {
    if (!editorSelection) return;
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[editorSelection.key];
      return next;
    });
    handleDialogToggle(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver
      </Button>

  <div className="rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600 text-white p-6 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{routine.name}</h1>
            <p className="text-sm text-slate-900 dark:text-slate-100">{routine.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase text-indigo-600 dark:text-indigo-300">
              <span className="rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/10">{routine.goal}</span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/10">{routine.level}</span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/10">
                {routine.sessionsPerWeek} sesiones
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/10">
                {routine.durationWeeks} semanas
              </span>
            </div>
          </div>
          <Button
            variant={isSelected ? "outline" : "primary"}
            className="gap-2"
            onClick={() => selectRoutine(routine.id)}
          >
            {isSelected ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Rutina activa
              </>
            ) : (
              "Activar rutina"
            )}
          </Button>
          {isSelected && (
            <Button className="gap-2" onClick={() => {
              toggleTimerVisible();
              startTimer();
            }}>
              {timerRunning ? "Reanudar" : "Iniciar rutina"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {routine.workouts.map((workout) => (
          <Card key={workout.day} className="dark:border-slate-800 dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base text-slate-700 dark:text-slate-100">
                <span>
                  {workout.day} · {workout.title}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {workout.exercises.length} ejercicios
                  </span>
                  {(() => {
                    const done = isWorkoutDoneForDay(workout.day);
                    return (
                      <Button
                        size="sm"
                        variant={done ? "muted" : "outline"}
                        onClick={() => (done ? unmarkWorkoutDone(workout.day) : markWorkoutDone(workout.day, workout.title))}
                        className="whitespace-nowrap"
                      >
                        {done ? "Hecho" : "Marcar como hecha"}
                      </Button>
                    );
                  })()}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workout.exercises.map((exercise) => {
                const info = exerciseLookup.get(exercise.exerciseId);
                const key = `${workout.day}:${exercise.exerciseId}`;
                const override = overrides[key];
                const sets = override?.sets ?? exercise.sets;
                const reps = override?.reps ?? exercise.reps;
                const note = override?.note ?? exercise.notes;

                const done = isExerciseDone(workout.day, exercise.exerciseId);

                return (
                  <ExerciseCard
                    key={exercise.exerciseId}
                    name={info?.name ?? exercise.exerciseId}
                    sets={sets}
                    reps={reps}
                    muscle={info?.primaryMuscle}
                    image={info?.image}
                    note={note}
                    highlight={Boolean(override)}
                    onClick={() => openEditor(workout.day, exercise)}
                    done={done}
                    onToggleDone={() => toggleExerciseDone(workout.day, exercise.exerciseId)}
                  />
                );
              })}
            </CardContent>
            {/* mostrar botón para marcar día completo sólo si todos los ejercicios están marcados y el día no está ya en history */}
            {(() => {
              const allDone = workout.exercises.every((ex) => isExerciseDone(workout.day, ex.exerciseId));
              const already = isWorkoutDoneForDay(workout.day);
              if (allDone && !already) {
                return (
                  <div className="p-4 border-t dark:border-slate-800">
                    <Button onClick={() => markWorkoutDone(workout.day, workout.title)} className="w-full">
                      Marcar día completo
                    </Button>
                  </div>
                );
              }
              return null;
            })()}
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="ghost" asChild>
          <Link to="/custom">Personalizar rutina</Link>
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
        {editorSelection && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editorSelection.name}</DialogTitle>
              <DialogDescription>
                Personaliza las series, repeticiones o notas para adaptar el ejercicio a tu progreso.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                {editorSelection.image ? (
                  <img
                    src={editorSelection.image}
                    alt={editorSelection.name}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-200">
                    <span className="text-sm font-semibold">Sin imagen</span>
                  </div>
                )}
          <div className="space-y-2 text-sm text-slate-900 dark:text-slate-300">
                  {editorSelection.muscle && <p>Músculo principal: {editorSelection.muscle}</p>}
                  {editorSelection.defaultNote && <p>Nota sugerida: {editorSelection.defaultNote}</p>}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500" htmlFor="editor-sets">
                    Series
                  </label>
                  <Input
                    id="editor-sets"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={editorValues.sets}
                    onChange={(event) =>
                      setEditorValues((prev) => ({ ...prev, sets: event.target.value.replace(/[^0-9]/g, "") }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500" htmlFor="editor-reps">
                    Repeticiones / Tiempo
                  </label>
                  <Input
                    id="editor-reps"
                    value={editorValues.reps}
                    onChange={(event) => setEditorValues((prev) => ({ ...prev, reps: event.target.value }))}
                    placeholder={editorSelection.defaultReps}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold uppercase text-slate-400 dark:text-slate-500" htmlFor="editor-note">
                    Nota personal
                  </label>
                  <Textarea
                    id="editor-note"
                    value={editorValues.note}
                    onChange={(event) => setEditorValues((prev) => ({ ...prev, note: event.target.value }))}
                    rows={3}
                    placeholder="Añade recordatorios o ajustes específicos"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Restablecer valores
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDialogToggle(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSave}>
                  Guardar cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
        {/* Snackbar / toast */}
        {toast && (
          <Toast
            message={toast}
            actionLabel={undoInfo ? "Deshacer" : undefined}
            onAction={undoInfo ? handleUndo : undefined}
            onClose={() => setToast(null)}
          />
        )}
    </div>
  );
}
