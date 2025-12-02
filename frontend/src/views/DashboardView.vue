<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Your Projects</h1>

    <!-- Create project form -->
    <form @submit.prevent="handleCreateProject" class="flex space-x-2 mb-6">
      <input
        v-model="newProjectTitle"
        type="text"
        placeholder="New project title"
        class="border px-3 py-2 rounded w-full"
        required
      />
      <button
        type="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        Add
      </button>
    </form>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-600">Loading projects...</div>

    <!-- Empty -->
    <div v-else-if="projects.length === 0" class="text-gray-500">
      You have no projects yet.
    </div>

    <!-- List -->
    <ul v-else class="space-y-3">
      <li
        v-for="project in projects"
        :key="project.id"
        @click="handleProjectDetail(project.id)"
        class="p-4 bg-white rounded-lg shadow border cursor-pointer hover:bg-gray-50"
      >
        <h2 class="text-lg font-semibold">{{ project.title }}</h2>
        <p class="text-sm text-gray-500">
          Created at: {{ formatDate(project.createdAt) }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProjects, createProject } from '../services/projectService'
import type { IProject } from '../types/types'

const loading = ref(true)
const projects = ref<IProject[]>([])
const newProjectTitle = ref("")
const router = useRouter()

// Load projects on enter
onMounted(async () => {
  try {
    projects.value = await getProjects()
  } finally {
    loading.value = false
  }
})

async function handleCreateProject() {
  if (!newProjectTitle.value.trim()) return

  try {
    const created = await createProject(newProjectTitle.value.trim())
    projects.value.push(created)
    newProjectTitle.value = ""
  } catch (err) {
    alert("Could not create project")
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-UK", { dateStyle: "short"})
}

function handleProjectDetail(id: string) {
  router.push(`/app/projects/${id}`)
}

</script>
