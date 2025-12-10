<template>
  <div class="space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-wide text-gray-400">Projects</p>
        <h1 class="text-3xl font-bold text-gray-900">Your Projects</h1>
      </div>

      <!-- New Project Button -->
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition cursor-pointer"
      >
        + New Project
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-600 bg-white border rounded-lg p-4 shadow-sm">Loading projects...</div>

    <!-- Empty -->
    <div v-else-if="projects.length === 0" class="text-gray-500 bg-white border rounded-lg p-6 shadow-sm text-center">
      You have no projects yet.
    </div>

    <!-- PROJECT LIST -->
    <ul v-else class="grid gap-4 sm:grid-cols-3">
      <li
        v-for="project in projects"
        :key="project.id"
        @click="handleProjectDetail(project.id)"
        class="p-4 bg-white rounded-lg shadow-sm border cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition"
      >
        <div class="flex items-start justify-between">
          <h2 class="text-lg font-semibold text-gray-900">{{ project.title }}</h2>
          <span class="text-xs text-gray-400">ID: {{ project.id.slice(0, 6) }}...</span>
        </div>

        <p class="text-xs text-gray-500 mt-1">Created: {{ formatDate(project.createdAt) }}</p>

        <!-- Extra info (status + priority) -->
        <div class="flex flex-col gap-2 mt-3 text-xs font-medium">
          <div class="flex items-center gap-4">
          <span class="w-9 text-left">Status: </span>
          <span class="px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
            {{ project.status }}
          </span>
          </div>
          <div class="flex items-center gap-2">
          <span class="w-11 text-left">Priority: </span>
          <span
            class="px-2 py-1 rounded-full border"
            :class="{
              'bg-green-50 text-green-700 border-green-100': project.priority === 'LOW',
              'bg-amber-50 text-amber-700 border-amber-100': project.priority === 'MEDIUM',
              'bg-red-50 text-red-700 border-red-100': project.priority === 'HIGH',
            }"
          >
            {{ project.priority }}
          </span>
          </div>
        </div>
      </li>
    </ul>

    <!-- MODAL -->
    <CreateProjectModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleProjectCreated"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects } from '../services/projectService'
import type { IProject } from '../types/types'
import CreateProjectModal from '../components/CreateProjectModal.vue'

const loading = ref(true)
const projects = ref<IProject[]>([])
const showCreateModal = ref(false)

const router = useRouter()

// Load projects on enter
onMounted(async () => {
  try {
    projects.value = await getProjects()
  } finally {
    loading.value = false
  }
})

function handleProjectCreated(project: IProject) {
  projects.value.push(project)
  showCreateModal.value = false
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-UK", { dateStyle: "short" })
}

function handleProjectDetail(id: string) {
  router.push(`/app/projects/${id}`)
}
</script>
