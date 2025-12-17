<template>
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 px-4 py-6 flex justify-center items-start overflow-y-auto">
    <div class="bg-white w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-100">
      <!-- Header -->
      <div class="flex justify-between items-center pb-2 border-b">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            {{ isEdit ? "Edit task" : "New task" }}
          </p>
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ isEdit ? "Update task" : "Create task" }}
          </h2>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 cursor-pointer">
          ×
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Title -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Title *</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Task title"
            required
          />
        </div>

        <!-- Description -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows="3"
            placeholder="What needs to be done?"
          ></textarea>
        </div>

        <!-- Deadline -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Deadline</label>
          <input
            v-model="form.deadline"
            type="date"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <p v-if="errorMsg" class="text-red-600 text-sm">{{ errorMsg }}</p>

        <div class="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm cursor-pointer"
            :disabled="loading"
          >
            {{ loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update Task" : "Create Task" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { createTask, updateTask } from "../services/taskService"
import type { ITask, ITaskPayload } from "../types/types"


const props = defineProps<{
  projectId: string
  task?: ITask | null
}>()

// Emit events for parent component
const emit = defineEmits<{
  (e: "created", task: ITask): void
  (e: "updated", task: ITask): void
  (e: "close"): void
}>()

const loading = ref(false)
const errorMsg = ref("")

// Form data
const form = ref<ITaskPayload>({
  title: "",
  description: "",
  deadline: undefined,
})

// Determine if editing or creating
const isEdit = computed(() => !!props.task ) // !! boolean conversion


onMounted(() => {
  document.body.classList.add("overflow-hidden") // Prevent background scrolling
})

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden")
})

// Watch for changes in the task prop to fill form when editing
watch(
  () => props.task,
  task => {
    if (task) {
      form.value = {
        title: task.title,
        description: task.description,
        deadline: task.deadline ? task.deadline.slice(0, 10) : undefined,
      }
    } else {
      form.value = {
        title: "",
        description: "",
        deadline: undefined,
      }
    }
    errorMsg.value = ""
  },
  { immediate: true } // Run immediately on component mount
)

async function handleSubmit() {
  errorMsg.value = ""

  if (!form.value.title.trim()) {
    errorMsg.value = "Title cannot be empty"
    return
  }

  loading.value = true

  try {
    const payload: ITaskPayload = {
      title: form.value.title.trim(),
      description: form.value.description?.trim() || undefined,
      deadline: form.value.deadline || undefined,
    }

    if (isEdit.value && props.task) {
      const updated = await updateTask(props.projectId, props.task.id, payload)
      emit("updated", updated)
    } else {
      const created = await createTask(props.projectId, payload)
      emit("created", created)
    }
  } catch (err: any) {
    errorMsg.value = err?.response?.data?.error || err?.message || "Failed to save task"
  } finally {
    loading.value = false
  }
}
</script>
