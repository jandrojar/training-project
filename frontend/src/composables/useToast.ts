import { readonly, ref } from "vue";
import type { IToast, ToastType } from "../types/types";

// Default toast duration in milliseconds.
const DEFAULT_TOAST_DURATION = 3500;

// Shared reactive list of toasts for the whole app.
const toasts = ref<IToast[]>([]);

// Generates a unique id for each toast.
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Removes a toast by id.
function remove(id: string) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}

// Adds a toast and schedules auto-removal.
function add(type: ToastType, message: string, duration = DEFAULT_TOAST_DURATION) {
  const id = generateId();
  const newToast: IToast = {
    id,
    type,
    message,
    duration,
  };
  toasts.value.push(newToast);

  window.setTimeout(() => remove(id), duration);

  return id;
}

export function useToast() {
  return {
    // Expose read-only list so external callers cannot mutate directly.
    toasts: readonly(toasts),

    success: (message: string, duration?: number) => add("success", message, duration),
    error: (message: string, duration?: number) => add("error", message, duration),
    warning: (message: string, duration?: number) => add("warning", message, duration),
    info: (message: string, duration?: number) => add("info", message, duration),

    remove,
    clear: () => {
      // Hard reset for all active toasts.
      toasts.value = [];
    },
  };
}
