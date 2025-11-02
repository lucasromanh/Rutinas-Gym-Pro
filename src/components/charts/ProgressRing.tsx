import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function ProgressRing({
  value,
  label,
  size = 140,
  strokeWidth = 12,
  color = "#4253ff",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value, 0), 100);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="overflow-visible">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7ff"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          animate={{ strokeDashoffset: circumference - (percent / 100) * circumference }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <text
          x="50%"
          y="50%"
          className="fill-slate-900 text-2xl font-semibold dark:fill-white"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {Math.round(percent)}%
        </text>
      </svg>
  {label && <span className="text-sm text-slate-500 dark:text-slate-200">{label}</span>}
    </div>
  );
}

export function MetricCard({
  title,
  value,
  helper,
  highlight,
  className,
}: {
  title: string;
  value: string;
  helper?: string;
  highlight?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900", className)}>
  <p className="text-sm text-slate-600 dark:text-slate-200">{title}</p>
  <p className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
  {highlight && <p className="mt-1 text-sm font-medium text-indigo-600 dark:text-indigo-300">{highlight}</p>}
  {helper && <p className="mt-2 text-xs text-slate-400 dark:text-slate-200">{helper}</p>}
    </div>
  );
}
