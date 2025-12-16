<template>
  <div class="space-y-8">

    <!-- HEADER -->
    <div class="space-y-2">
      <p class="text-sm uppercase tracking-wide text-gray-400">Project</p>

      <div class="flex flex-wrap items-center gap-8">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ project?.title }}
        </h1>

        <!-- Status -->
        <div v-if="project" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Status:</span>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium border"
            :class="statusClasses(project.status)"
          >
            {{ project.status }}
          </span>
        </div>

        <!-- Priority -->
        <div v-if="project" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">Priority:</span>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium border"
            :class="priorityClasses(project.priority)"
          >
            {{ project.priority }}
          </span>
        </div>
      </div>

      <p class="text-sm text-gray-500 mt-6">
        Project ID: {{ project?.id }}
      </p>
    </div>

    <!-- LOADING / ERROR -->
    <div
      v-if="loading"
      class="bg-white border rounded-lg p-6 shadow-sm text-gray-600"
    >
      Loading project...
    </div>

    <div
      v-else-if="!project"
      class="bg-white border rounded-lg p-6 shadow-sm text-red-600"
    >
      Project not found.
    </div>

    <!-- CONTENT -->
    <template v-else>

      <!-- GENERAL INFO -->
      <section class="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        <h2 class="text-lg font-semibold text-gray-900">General information</h2>

        <div v-if="project.description">
          <p class="text-sm text-gray-500 mb-1">Description</p>
          <p class="text-gray-800">
            {{ project.description }}
          </p>
        </div>

        <div v-else class="text-sm text-gray-400 italic">
          No description provided.
        </div>

        <!-- TAGS -->
        <div>
          <p class="text-sm text-gray-500 mb-2">Tags</p>

          <div v-if="project.tags.length" class="flex flex-wrap gap-2">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 border"
            >
              {{ tag }}
            </span>
          </div>

          <div v-else class="text-sm text-gray-400 italic">
            No tags.
          </div>
        </div>
      </section>

      <!-- TASKS -->
      <section class="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-gray-900">Tasks</h2>
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{ tasks.length }} total</span>
            <button
              class="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-sm cursor-pointer"
              @click="openCreateTask"
            >
              + New Task
            </button>
          </div>
        </div>

        <div v-if="tasksLoading" class="text-sm text-gray-600">
          Loading tasks...
        </div>

        <div v-else-if="tasksError" class="text-sm text-red-600">
          {{ tasksError }}
        </div>

        <div v-else-if="!tasks.length" class="text-sm text-gray-400 italic">
          No tasks yet.
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="task in tasks"
            :key="task.id"
            class="border rounded-lg p-3 shadow-sm bg-gray-50/80"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-gray-900">{{ task.title }}</p>
                <p v-if="task.description" class="text-sm text-gray-600">
                  {{ task.description }}
                </p>
              </div>

              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium border"
                  :class="task.done ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-100 text-gray-700 border-gray-200'"
                >
                  {{ task.done ? "Done" : "Pending" }}
                </span>
                <div class="flex items-center gap-2 text-gray-500">
                  <button
                    class="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                    @click="toggleTaskDone(task)"
                    :disabled="taskActioningId === task.id"
                    title="Toggle done"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </button>
                  <button
                    class="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
                    @click="openEditTask(task)"
                    :disabled="taskActioningId === task.id"
                    title="Edit task"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h9"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4z"></path>
                    </svg>
                  </button>
                  <button
                    class="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 cursor-pointer disabled:opacity-50"
                    @click="handleDeleteTask(task)"
                    :disabled="taskActioningId === task.id"
                    title="Delete task"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-3 0h14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-3 text-xs text-gray-500 flex gap-4 flex-wrap">
              <span v-if="task.deadline">Deadline: {{ formatDateShort(task.deadline) }}</span>
              <span>Created: {{ formatDateShort(task.createdAt) }}</span>
              <span>Updated: {{ formatDateShort(task.updatedAt) }}</span>
            </div>
          </article>
        </div>
      </section>

      <!-- DATES -->
      <section class="bg-white border rounded-lg p-6 shadow-sm space-y-3">
        <h2 class="text-lg font-semibold text-gray-900">Dates</h2>

        <p class="text-sm text-gray-700">
          <strong>Deadline:</strong> {{ project.deadline ? formatDate(project.deadline) : "No deadline set" }} 
        </p>

        <p class="text-sm text-gray-700">
          <strong>Created at:</strong> {{ formatDate(project.createdAt) }}
        </p>

        <p class="text-sm text-gray-700">
          <strong>Updated at:</strong> {{ formatDate(project.updatedAt) }}
        </p>
      </section>

    </template>

  </div>

  <CreateTaskModal
    v-if="showTaskModal && project"
    :project-id="project.id"
    :task="editingTask"
    @close="closeTaskModal"
    @created="handleTaskCreated"
    @updated="handleTaskUpdated"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { getProject } from "../services/projectService"
import { deleteTask, getTasks, updateTaskDone } from "../services/taskService"
import type { IProject, ITask } from "../types/types"
import { priorityClasses, statusClasses } from "../helpers/projectBadgeClasses"
import { formatDate, formatDateShort } from "../helpers/formatDates"
import CreateTaskModal from "../components/CreateTaskModal.vue"

const route = useRoute()
const loading = ref(true)
const tasksLoading = ref(true)
const project = ref<IProject | null>(null)
const tasks = ref<ITask[]>([])
const tasksError = ref<string | null>(null)
const showTaskModal = ref(false)
const editingTask = ref<ITask | null>(null)
const taskActioningId = ref<string | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  try {
    project.value = await getProject(id)
  } catch {
    project.value = null
  } finally {
    loading.value = false
  }

  await loadTasks(id)
})

async function loadTasks(projectId: string) {
  tasksLoading.value = true
  tasksError.value = null
  try {
    tasks.value = await getTasks(projectId)
  } catch (err: any) {
    tasksError.value = err?.message || "Could not load tasks."
  } finally {
    tasksLoading.value = false
  }
}

function handleTaskCreated(task: ITask) {
  tasks.value.unshift(task)
  closeTaskModal()
}

function handleTaskUpdated(task: ITask) {
  const idx = tasks.value.findIndex(t => t.id === task.id)
  if (idx !== -1) {
    tasks.value.splice(idx, 1, task)
  }
  closeTaskModal()
}

function openCreateTask() {
  editingTask.value = null
  showTaskModal.value = true
}

function openEditTask(task: ITask) {
  editingTask.value = task
  showTaskModal.value = true
}

function closeTaskModal() {
  showTaskModal.value = false
  editingTask.value = null
}

async function toggleTaskDone(task: ITask) {
  if (!project.value) return
  taskActioningId.value = task.id
  try {
    const updated = await updateTaskDone(project.value.id, task.id, !task.done)
    const idx = tasks.value.findIndex(t => t.id === task.id)
    if (idx !== -1) tasks.value.splice(idx, 1, updated)
  } catch (err: any) {
    tasksError.value = err?.message || "Could not update task."
  } finally {
    taskActioningId.value = null
  }
}

async function handleDeleteTask(task: ITask) {
  if (!project.value) return
  const confirmed = window.confirm("Delete this task?")
  if (!confirmed) return
  taskActioningId.value = task.id
  try {
    await deleteTask(project.value.id, task.id)
    tasks.value = tasks.value.filter(t => t.id !== task.id)
  } catch (err: any) {
    tasksError.value = err?.message || "Could not delete task."
  } finally {
    taskActioningId.value = null
  }
}
</script>
