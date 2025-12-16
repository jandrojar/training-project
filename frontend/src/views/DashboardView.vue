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

        <p class="text-xs text-gray-500 mt-1">Created: {{ formatDateShort(project.createdAt) }}</p>

        <div class="flex items-center gap-2 mt-2 text-xs font-medium">
          <span
            class="px-2 py-1 rounded-full border"
            :class="statusClasses(project.status)"
          >
            {{ project.status }}
          </span>
          <span
            class="px-2 py-1 rounded-full border"
            :class="priorityClasses(project.priority)"
          >
            {{ project.priority }}
          </span>
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
import { priorityClasses, statusClasses } from '../helpers/projectBadgeClasses'
import { formatDateShort } from '../helpers/formatDates'
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

function handleProjectDetail(id: string) {
  router.push(`/app/projects/${id}`)
}
</script>
