import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div
      className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium dark:bg-slate-800"
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Sun className="h-4 w-4 text-amber-500" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 text-indigo-500" />
    </motion.div>
  );
}
