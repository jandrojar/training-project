<template>
  <!-- Overlay -->
  <div class="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 px-4 py-6 flex justify-center items-start overflow-y-auto">

    
    <!-- Modal -->
    <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-100 ">

      <!-- Header -->
      <div class="flex justify-between items-center pb-2 border-b">
        <div>
          <p class="text-xs uppercase tracking-wide text-gray-400">
            {{ isEdit ? "Edit project" : "New project" }}
          </p>
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ isEdit ? "Update project" : "Create project" }}
          </h2>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-700 text-2xl leading-none px-2 cursor-pointer">
          ×
        </button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="handleSubmit" class="space-y-5">

        <!-- TITLE -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Title *</label>
          <input
            v-model="form.title"
            type="text"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Project title"
            required
          />
        </div>

        <!-- DESCRIPTION -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Description</label>
          <textarea
            v-model="form.description"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            rows="3"
            placeholder="Add a short description"
          ></textarea>
        </div>

        <!-- STATUS -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-gray-700">Status</label>
            <select v-model="form.status" class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="PLANNED">Planned</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_HOLD">On hold</option>
          </select>
          </div>

          <!-- PRIORITY -->
          <div class="space-y-1">
            <label class="block text-sm font-semibold text-gray-700">Priority</label>
            <select v-model="form.priority" class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        </div>

        <!-- TAGS -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Tags (comma-separated)</label>
          <input
            v-model="tagsInput"
            type="text"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="e.g. work, personal, urgent"
          />
        </div>

        <!-- DEADLINE -->
        <div class="space-y-1">
          <label class="block text-sm font-semibold text-gray-700">Deadline</label>
          <input
            v-model="form.deadline"
            type="date"
            class="w-full border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <!-- ACTIONS -->
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
            {{
              loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Project"
                  : "Create Project"
            }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import { createProject, updateProject } from "../services/projectService"
import type { IProject, IProjectPayload } from "../types/types"
import { useToast } from "../composables/useToast"

const props = defineProps<{
  project?: IProject | null
}>()

const emit = defineEmits<{
  (e: "created", project: IProject): void
  (e: "updated", project: IProject): void
  (e: "close"): void
}>()

// STATE
const loading = ref(false)

// FORM DATA
const form = ref<IProjectPayload>({
  title: "",
  description: "",
  status: "PLANNED",
  priority: "MEDIUM",
  tags: [],
  deadline: undefined,
})

// RAW TAGS INPUT
const tagsInput = ref("")

const isEdit = computed(() => !!props.project)

onMounted(() => {
  document.body.classList.add("overflow-hidden")
})

onUnmounted(() => {
  document.body.classList.remove("overflow-hidden")
})

watch(
  () => props.project,
  project => {
    if (project) {
      form.value = {
        title: project.title,
        description: project.description || "",
        status: project.status,
        priority: project.priority,
        tags: project.tags,
        deadline: project.deadline ? project.deadline.slice(0, 10) : undefined,
      }
      tagsInput.value = project.tags.join(", ")
    } else {
      form.value = {
        title: "",
        description: "",
        status: "PLANNED",
        priority: "MEDIUM",
        tags: [],
        deadline: undefined,
      }
      tagsInput.value = ""
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  if (!form.value.title.trim()) {
    useToast().error("Title cannot be empty")
    return
  }

  loading.value = true

  try {
    // Normalize tags
    const tags = tagsInput.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean)

    const payload: IProjectPayload = {
      ...form.value,
      tags,
    }

    if (isEdit.value && props.project) {
      const updated = await updateProject(props.project.id, payload)
      emit("updated", updated)
    } else {
      const created = await createProject(payload)
      emit("created", created)
    }
    useToast().success(isEdit.value ? "Project updated successfully" : "Project created successfully")
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    useToast().error(message)
  } finally {
    loading.value = false
  }
}
</script>
