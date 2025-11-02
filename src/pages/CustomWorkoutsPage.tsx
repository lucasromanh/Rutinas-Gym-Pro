import { useState } from "react";
import type { FormEvent } from "react";
import { PlusCircle, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWorkouts } from "@/context/WorkoutContext";

interface ExerciseForm {
  name: string;
  sets: number;
  reps: string;
  load?: string;
}

const emptyExercise: ExerciseForm = { name: "", sets: 3, reps: "12" };

export default function CustomWorkoutsPage() {
  const { customWorkouts, addCustomWorkout, deleteCustomWorkout } = useWorkouts();
  const [form, setForm] = useState({
    name: "",
    focusAreas: "",
    notes: "",
    exercises: [emptyExercise],
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    addCustomWorkout({
      name: form.name,
      focusAreas: form.focusAreas.split(",").map((item) => item.trim()).filter(Boolean),
      exercises: form.exercises,
    });

    setForm({
      name: "",
      focusAreas: "",
      notes: "",
      exercises: [emptyExercise],
    });
  };

  const updateExercise = (index: number, exercise: Partial<ExerciseForm>) => {
    setForm((prev) => {
      const exercises = [...prev.exercises];
      exercises[index] = { ...exercises[index], ...exercise };
      return { ...prev, exercises };
    });
  };

  const addExercise = () => {
    setForm((prev) => ({ ...prev, exercises: [...prev.exercises, emptyExercise] }));
  };

  const removeExercise = (index: number) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Crea tu entrenamiento</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submit}>
            <Input
              placeholder="Nombre del entrenamiento"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
            <Input
              placeholder="Zonas clave (separadas por coma)"
              value={form.focusAreas}
              onChange={(event) => setForm((prev) => ({ ...prev, focusAreas: event.target.value }))}
            />
            <Textarea
              placeholder="Notas o instrucciones especiales"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
            />
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-500">Ejercicios</p>
              {form.exercises.map((exercise, index) => (
                <div key={index} className="rounded-3xl bg-slate-50 p-4 shadow-inner dark:bg-slate-900/70">
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input
                      placeholder="Ejercicio"
                      value={exercise.name}
                      onChange={(event) => updateExercise(index, { name: event.target.value })}
                    />
                    <Input
                      type="number"
                      placeholder="Series"
                      value={exercise.sets}
                      onChange={(event) => updateExercise(index, { sets: Number(event.target.value) })}
                    />
                    <Input
                      placeholder="Reps"
                      value={exercise.reps}
                      onChange={(event) => updateExercise(index, { reps: event.target.value })}
                    />
                    <Input
                      placeholder="Carga"
                      value={exercise.load ?? ""}
                      onChange={(event) => updateExercise(index, { load: event.target.value })}
                    />
                  </div>
                  {form.exercises.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={() => removeExercise(index)}>
                      <Trash className="h-4 w-4" /> Borrar ejercicio
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addExercise} className="gap-2">
                <PlusCircle className="h-4 w-4" /> Añadir ejercicio
              </Button>
            </div>
            <Button type="submit">Guardar entrenamiento</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Tus rutinas personalizadas</h2>
        {customWorkouts.map((workout) => (
          <Card key={workout.id} className="bg-gradient-to-br from-indigo-500 via-indigo-400 to-indigo-600 text-white dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-white dark:text-slate-100">{workout.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-indigo-100 dark:text-slate-200">
              <p>Zonas: {workout.focusAreas.join(", ") || "General"}</p>
              <ul className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <li key={`${workout.id}-${index}`} className="flex items-center justify-between">
                    <span>
                      {exercise.name} · {exercise.sets}x{exercise.reps}
                    </span>
                    {exercise.load && <span className="text-xs text-indigo-200">{exercise.load}</span>}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="ghost" onClick={() => deleteCustomWorkout(workout.id)} className="gap-2 text-red-500">
                <Trash className="h-4 w-4" /> Eliminar
              </Button>
            </CardFooter>
          </Card>
        ))}
  {!customWorkouts.length && <p className="text-sm text-slate-900 dark:text-slate-100">Aún no tienes entrenamientos personalizados.</p>}
      </div>
    </div>
  );
}
