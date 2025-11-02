import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Target, Weight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import onboardingArt from "@/assets/onboarding.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useUser, type UserProfile } from "@/context/UserContext";
import { cn } from "@/lib/utils";

type StepKey = "profile" | "goal" | "focus";

const steps: Array<{ key: StepKey; title: string; description: string }> = [
  {
    key: "profile",
    title: "Datos básicos",
    description: "Cuéntanos sobre ti para ajustar las referencias.",
  },
  {
    key: "goal",
    title: "Objetivo y nivel",
    description: "Definimos la intensidad adecuada para tus sesiones.",
  },
  {
    key: "focus",
    title: "Zonas favoritas",
    description: "Elegimos los músculos que quieres potenciar.",
  },
];

const focusGroups = [
  { id: "chest", label: "Pecho" },
  { id: "legs", label: "Piernas" },
  { id: "back", label: "Espalda" },
  { id: "shoulders", label: "Hombros" },
  { id: "core", label: "Core" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useUser();
  const [currentStep, setCurrentStep] = useState<StepKey>("profile");
  const [form, setForm] = useState<UserProfile>({
    name: profile?.name ?? "",
    age: profile?.age,
    height: profile?.height,
    weight: profile?.weight,
    goal: profile?.goal ?? "fat-loss",
    level: profile?.level ?? "beginner",
    weeklyFrequency: profile?.weeklyFrequency ?? 3,
    focusAreas: profile?.focusAreas ?? ["chest", "legs"],
  });

  const stepIndex = steps.findIndex((step) => step.key === currentStep);
  const progress = useMemo(() => ((stepIndex + 1) / steps.length) * 100, [stepIndex]);
  const [canSubmit, setCanSubmit] = useState(stepIndex === steps.length - 1);

  useEffect(() => {
    if (currentStep === "focus") {
      const timer = window.setTimeout(() => setCanSubmit(true), 250);
      return () => window.clearTimeout(timer);
    }
    setCanSubmit(false);
  }, [currentStep]);

  const goNext = () => {
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key);
    } else {
      navigate("/");
    }
  };

  const toggleFocus = (id: string) => {
    setForm((prev) => {
      const focusAreas = prev.focusAreas ?? [];
      return focusAreas.includes(id)
        ? { ...prev, focusAreas: focusAreas.filter((area) => area !== id) }
        : { ...prev, focusAreas: [...focusAreas, id] };
    });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    completeOnboarding({ ...form, onboardingComplete: true });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-light px-4 py-10 dark:bg-slate-950">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center gap-4 text-center">
          <img src={onboardingArt} alt="Onboarding" className="h-32 w-32" />
          <CardTitle className="text-2xl">Bienvenido a Rutina Gym Pro</CardTitle>
          <p className="max-w-xs text-sm text-slate-500">
            Configuramos tu experiencia con rutinas inteligentes y métricas personalizadas.
          </p>
          <div className="h-2 w-full rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={submit}>
            {currentStep === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Input
                  placeholder="Tu nombre"
                  value={form.name ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Altura (cm)"
                    value={form.height ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, height: Number(event.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={form.weight ?? ""}
                    onChange={(event) => setForm((prev) => ({ ...prev, weight: Number(event.target.value) }))}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === "goal" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={cn(
                        "rounded-3xl border p-4 text-left transition",
                        form.goal === option.value
                          ? "border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-400/70 dark:bg-indigo-500/15 dark:text-indigo-100"
                          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
                      )}
                      onClick={() => setForm((prev) => ({ ...prev, goal: option.value }))}
                    >
                      <option.icon className="mb-2 h-5 w-5" />
                      <p className="text-sm font-semibold">{option.label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{option.description}</p>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-200">Nivel actual</p>
                  <select
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    value={form.level}
                    onChange={(event) => setForm((prev) => ({ ...prev, level: event.target.value as UserProfile["level"] }))}
                  >
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <Weight className="h-4 w-4 text-indigo-500" /> Sesiones por semana: {form.weeklyFrequency}
                  </p>
                  <Slider
                    min={2}
                    max={7}
                    step={1}
                    value={[form.weeklyFrequency ?? 3]}
                    onValueChange={([value]) =>
                      setForm((prev) => ({ ...prev, weeklyFrequency: value }))
                    }
                  />
                </div>
              </motion.div>
            )}

            {currentStep === "focus" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <p className="text-sm text-slate-500">
                  Selecciona los grupos musculares que más te interesan. Usaremos esta info para priorizar
                  entrenamientos.
                </p>
                <div className="flex flex-wrap gap-3">
                  {focusGroups.map((group) => (
                    <button
                      type="button"
                      key={group.id}
                      onClick={() => toggleFocus(group.id)}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition",
                        form.focusAreas?.includes(group.id)
                          ? "bg-indigo-600 text-white shadow dark:bg-indigo-500 dark:text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                      )}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <Button type="button" variant="ghost" onClick={goBack}>
                Volver
              </Button>
              {currentStep !== "focus" ? (
                <Button type="button" onClick={goNext}>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={!canSubmit}>
                  Guardar perfil
                  <Target className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const goalOptions = [
  {
    value: "fat-loss" as UserProfile["goal"],
    label: "Definición",
    description: "Reduce grasa manteniendo tu músculo.",
    icon: Target,
  },
  {
    value: "muscle" as UserProfile["goal"],
    label: "Hipertrofia",
    description: "Maximiza volumen muscular.",
    icon: Weight,
  },
  {
    value: "performance" as UserProfile["goal"],
    label: "Rendimiento",
    description: "Más fuerza y potencia.",
    icon: ArrowRight,
  },
  {
    value: "health" as UserProfile["goal"],
    label: "Salud",
    description: "Mantén energía y bienestar.",
    icon: Target,
  },
];
