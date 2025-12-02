<template>
  <div class="space-y-6">

    <!-- Header with project title -->
    <div class="space-y-1">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ project?.title }}
      </h1>
      <p class="text-gray-500 text-sm">
        Project ID: {{ project?.id }}
      </p>
    </div>

    <!-- Section: General information -->
    <section class="p-4 bg-white shadow rounded-lg border">
      <h2 class="text-lg font-semibold mb-3">General information</h2>

      <div v-if="loading" class="text-gray-600">Loading project...</div>
      <div v-else-if="!project" class="text-red-600">Project not found.</div>

      <div v-else class="space-y-2">
        <p><strong>Title:</strong> {{ project.title }}</p>

        <!-- Placeholder for future project fields -->
        <div class="mt-4 p-3 bg-gray-50 border rounded-lg text-gray-500 text-sm">
          Additional project details will be added here in the future.
        </div>
      </div>
    </section>

    <!-- Section: Dates -->
    <section v-if="project" class="p-4 bg-white shadow rounded-lg border">
        <h2 class="text-lg font-semibold mb-3">Dates</h2>

        <p><strong>Created at:</strong> {{ formatDate(project.createdAt) }}</p>
        <p><strong>Updated at:</strong> {{ formatDate(project.updatedAt) }}</p>
    </section>


    <!-- Placeholder for future tasks -->
    <section class="p-4 bg-gray-50 shadow-inner rounded-lg border">
      <h2 class="text-lg font-semibold mb-3">Tasks</h2>
      <p class="text-gray-500">Tasks section will be implemented soon.</p>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProject } from '../services/projectService'
import type { IProject } from '../types/types'

const route = useRoute()
const loading = ref(true)
const project = ref<IProject | null>(null)

onMounted(async () => {
  try {
    const id = route.params.id as string
    project.value = await getProject(id)
  } catch (error) {
    project.value = null
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}
</script>
