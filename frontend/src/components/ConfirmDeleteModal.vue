<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 px-4 py-6 flex justify-center items-start overflow-y-auto"
       @click.self="emitClose" >
    <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-100">
      <div class="flex justify-between items-center pb-2 border-b">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            {{ resolvedSubtitle }}
          </p>
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ resolvedTitle }}
          </h2>
        </div>
        <button @click="emitClose" class="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 cursor-pointer">
          ×
        </button>
      </div>

      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          {{ resolvedDescription }}
        </p>

        <div v-if="itemName" class="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {{ itemName }}
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          @click="emitClose"
          class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
          :disabled="loading"
        >
          {{ resolvedCancelLabel }}
        </button>

        <button
          type="button"
          @click="emitConfirm"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 shadow-sm cursor-pointer"
          :disabled="loading || confirmDisabled"
        >
          {{ loading ? resolvedLoadingLabel : resolvedConfirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from "vue"

const props = defineProps<{
  entityLabel?: string
  itemName?: string
  title?: string
  subtitle?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loadingLabel?: string
  loading?: boolean
  confirmDisabled?: boolean
}>()

const emit = defineEmits<{
  (e: "confirm"): void
  (e: "close"): void
}>()

const resolvedEntityLabel = computed(() => props.entityLabel?.trim() || "item")
const resolvedTitle = computed(() => props.title?.trim() || `Delete ${resolvedEntityLabel.value}`)
const resolvedSubtitle = computed(() => props.subtitle?.trim() || "Confirm deletion")
const resolvedConfirmLabel = computed(() => props.confirmLabel?.trim() || "Delete")
const resolvedCancelLabel = computed(() => props.cancelLabel?.trim() || "Cancel")
const resolvedLoadingLabel = computed(() => props.loadingLabel?.trim() || "Deleting...")
const resolvedDescription = computed(() => {
  if (props.description?.trim()) return props.description.trim()
  const nameSuffix = props.itemName?.trim() ? ` "${props.itemName.trim()}"` : ""
  return `Are you sure you want to delete this ${resolvedEntityLabel.value}${nameSuffix}? This action cannot be undone.`
})

const itemName = computed(() => props.itemName?.trim() || "")
const loading = computed(() => !!props.loading)
const confirmDisabled = computed(() => !!props.confirmDisabled)

function emitClose() {
  emit("close")
}

function emitConfirm() {
  emit("confirm")
}

onMounted(() => {
  document.body.classList.add("overflow-hidden")
})

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden")
})
</script>
