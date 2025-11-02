import { useCallback, useEffect, useState } from "react";
import { Play, Pause, X, StopCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkouts } from "@/context/WorkoutContext";

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function TimerFloating() {
  const {
  timerRunning,
  timerExpanded,
    elapsedSeconds,
    startTimer,
    stopTimer,
    resetTimer,
    toggleTimerExpanded,
  } = useWorkouts();
  // rest state: input as string so user can clear it without forcing 0,
  // restTotalSeconds holds the last started rest length (seconds), restRemaining counts down.
  const [restInputStr, setRestInputStr] = useState("1");
  const [restTotalSeconds, setRestTotalSeconds] = useState<number | null>(null);
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [restId, setRestId] = useState<number | null>(null);

  // progress ring values for rest (animated)
  const restProgress = restTotalSeconds && restRemaining !== null ? (restTotalSeconds - restRemaining) / restTotalSeconds : 0;
  const R = 70; // radius for outer ring (matches panel size)
  const C = 2 * Math.PI * R;
  const dashOffset = C * (1 - restProgress);

  const startRest = useCallback(() => {
    if (restId) return;
    // parse minutes from the string; allow empty -> use previous total or default 1
    const parsed = Number.parseFloat(restInputStr.replace(/[^0-9.]/g, ""));
    const minutes = Number.isFinite(parsed) && parsed > 0 ? parsed : (restTotalSeconds ? restTotalSeconds / 60 : 1);
    const seconds = Math.max(1, Math.round(minutes * 60));
    setRestTotalSeconds(seconds);
    setRestRemaining(seconds);
    const id = window.setInterval(() => {
      setRestRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          window.clearInterval(id);
          setRestId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setRestId(id);
  }, [restInputStr, restId, restTotalSeconds]);

  const stopRest = useCallback(() => {
    if (restId) window.clearInterval(restId);
    setRestId(null);
    setRestRemaining(null);
  }, [restId]);

  useEffect(() => {
    return () => {
      if (restId) window.clearInterval(restId);
    };
  }, [restId]);
  // Center the widget at the top of the viewport so it's easier to reach.
  // Only one UI panel is visible at a time (small circle or large panel).
  return (
    <div className="fixed inset-x-0 top-6 z-50 flex justify-center pointer-events-none">
      {/* collapsed circular clock (visible when not expanded) */}
      {!timerExpanded && (
        <div className="relative pointer-events-auto">
          <button
            onClick={toggleTimerExpanded}
            aria-label="Abrir temporizador"
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-900"
            style={{ touchAction: "manipulation" }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-indigo-200 dark:border-indigo-700" />
            <div className="z-10 text-sm font-semibold text-slate-800 dark:text-slate-100">{formatTime(elapsedSeconds)}</div>
          </button>
        </div>
      )}

      {/* expanded circular panel centered under the button */}
      {timerExpanded && (
        <div className="mt-3 pointer-events-auto flex justify-center w-full">
          <div className="relative w-80 h-80 rounded-full bg-white shadow-lg dark:bg-slate-800 overflow-visible">
            {/* larger close button (top-right) */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleTimerExpanded(); }}
              aria-label="Cerrar temporizador"
              className="absolute -top-4 -right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-900"
              style={{ touchAction: "manipulation" }}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
              <div className="text-sm text-slate-500 dark:text-slate-300">Temporizador</div>

              {/* main timer is large and centered when no rest; shrinks when rest active */}
              <div className={restRemaining === null ? "text-5xl font-bold text-slate-900 dark:text-slate-100" : "text-lg font-bold text-slate-900 dark:text-slate-100"}>
                {formatTime(elapsedSeconds)}
              </div>

              {/* full-size SVG ring covering the whole panel; visible only while rest is running */}
              <div className="relative flex items-center justify-center w-full h-40">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 160 160" preserveAspectRatio="xMidYMid meet">
                  <circle cx="80" cy="80" r={R} strokeWidth="8" stroke="rgba(0,0,0,0.06)" fill="none" />
                  <circle
                    cx="80"
                    cy="80"
                    r={R}
                    strokeWidth="8"
                    stroke="#6366F1"
                    fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.6s linear", opacity: restRemaining !== null ? 1 : 0 }}
                    transform="rotate(-90 80 80)"
                  />
                </svg>

                {restRemaining !== null ? (
                  <div className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 z-10">{formatTime(restRemaining)}</div>
                ) : (
                  <div className="h-12" />
                )}
              </div>

              <div className="flex items-center gap-4">
                <Button
                  className="h-12 w-12 flex items-center justify-center bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => (timerRunning ? stopTimer() : startTimer())}
                >
                  {timerRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                <Button
                  className="h-12 w-12 flex items-center justify-center bg-red-600 text-white hover:bg-red-700"
                  onClick={resetTimer}
                >
                  <StopCircle className="h-6 w-6" />
                </Button>
              </div>

              <div className="mt-2 flex w-full flex-col items-center gap-2 px-6">
                <label className="text-sm font-semibold text-slate-600">Minutos de descanso</label>
                <div className="flex w-full items-center gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={restInputStr}
                    onChange={(e) => setRestInputStr(e.target.value)}
                    placeholder="1.0"
                    className="w-32 rounded-lg border border-slate-300 bg-white text-slate-900 px-3 py-2 text-lg dark:bg-slate-700 dark:text-slate-100 dark:border-slate-600"
                    aria-label="Minutos de descanso"
                  />
                  <div className="flex-1">
                    <Button onClick={startRest} className="w-full py-2">Iniciar descanso</Button>
                  </div>
                </div>
                <div className="w-full">
                  <Button variant="outline" onClick={stopRest} className="w-full">Detener</Button>
                </div>
                <div className="text-sm text-slate-400">{restRemaining !== null ? `${formatTime(restRemaining)} restante` : ""}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimerFloating;

