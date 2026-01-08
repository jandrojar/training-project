<template>
  <div class="fixed top-4 right-4 z-60 flex flex-col gap-3 w-full max-w-sm px-4 sm:px-0">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="rounded-xl border shadow-lg p-4 flex items-start gap-3"
      :class="toastBorderClass(t.type)"
      role="status"
      aria-live="polite"
    >
      <div class="flex-1">
        <p class="text-sm text-gray-800">
          {{ t.message }}
        </p>
      </div>

      <button
        class="text-gray-400 hover:text-gray-700 cursor-pointer px-2 -mr-2"
        @click="remove(t.id)"
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast} from "../composables/useToast"
import type { ToastType } from "../types/types"
const { toasts, remove } = useToast()

function toastBorderClass(type: ToastType) {
  if (type === "success") return "border-green-200 bg-green-100"
  if (type === "error") return "border-red-200 bg-red-100"
  if (type === "warning") return "border-yellow-200 bg-yellow-100"
  return "border-blue-200 bg-blue-100"
}
</script>
