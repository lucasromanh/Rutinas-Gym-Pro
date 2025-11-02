import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

interface WeeklyVolumeChartProps {
  data: Array<{ week: string; volume: number }>;
}

export function WeeklyVolumeChart({ data }: WeeklyVolumeChartProps) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4253ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4253ff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} />
          <XAxis dataKey="week" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={false}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #e0e7ff",
              background: "#ffffff",
            }}
            labelStyle={{ color: "#475569", fontWeight: 600 }}
            formatter={(value: number) => [`${value.toLocaleString()} kg`, "Volumen"]}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#4253ff"
            strokeWidth={3}
            fill="url(#colorVolume)"
            dot={{ r: 3, fill: "#4253ff" }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
