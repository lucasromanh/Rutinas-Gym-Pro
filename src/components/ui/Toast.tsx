import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        className="fixed left-1/2 bottom-6 z-50 -translate-x-1/2"
      >
        <div className="flex items-center gap-3 rounded-lg bg-slate-900/90 px-4 py-2 text-sm text-white shadow-lg backdrop-blur">
          <div className="flex-1">{message}</div>
          {actionLabel && (
            <button
              onClick={onAction}
              className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold hover:bg-white/20"
            >
              {actionLabel}
            </button>
          )}
          <button onClick={onClose} className="p-1 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
