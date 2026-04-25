"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: Toast) => void)[] = [];

export function toast(message: string, type: ToastType = "info") {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, message, type };
  toastListeners.forEach((l) => l(newToast));
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: "border-green-500/30 bg-green-950/60 text-green-300",
  error: "border-red-500/30 bg-red-950/60 text-red-300",
  info: "border-brand-500/30 bg-brand-950/60 text-brand-300",
};

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4000);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter((l) => l !== listener); };
  }, []);

  return (
    <div className="fixed bottom-28 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div key={t.id} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl border glass text-sm font-medium animate-slide-up max-w-sm", styles[t.type])}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
