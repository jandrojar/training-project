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
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { getProject } from "../services/projectService"
import type { IProject } from "../types/types"
import { priorityClasses, statusClasses } from "../helpers/projectBadgeClasses"
import { formatDate } from "../helpers/formatDates"

const route = useRoute()
const loading = ref(true)
const project = ref<IProject | null>(null)

onMounted(async () => {
  try {
    const id = route.params.id as string
    project.value = await getProject(id)
  } catch {
    project.value = null
  } finally {
    loading.value = false
  }
})



</script>
