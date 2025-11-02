import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const { routines, selectRoutine, selectedRoutineId } = useWorkouts();
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
            <p className="text-sm text-slate-500">
              La rutina que buscabas no existe o fue removida. Vuelve a la lista y selecciona otra opción.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSelected = selectedRoutineId === routine.id;

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

      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">{routine.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{routine.summary}</p>
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
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {workout.exercises.length} ejercicios
                </span>
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
                  />
                );
              })}
            </CardContent>
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
                <div className="space-y-2 text-sm text-slate-500 dark:text-slate-300">
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
    </div>
  );
}
