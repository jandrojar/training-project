<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-wide text-gray-400">Projects</p>
        <h1 class="text-3xl font-bold text-gray-900">Your Projects</h1>
      </div>

      <!-- New Project Button -->
      <button
        class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm transition cursor-pointer"
        @click="openCreateProject"
      >
        + New Project
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-600 bg-white border rounded-lg p-4 shadow-sm">
      Loading projects...
    </div>

    <!-- Empty -->
    <div
      v-else-if="projects.length === 0"
      class="text-gray-500 bg-white border rounded-lg p-6 shadow-sm text-center"
    >
      You have no projects yet.
    </div>

    <!-- PROJECT LIST -->
    <ul v-else class="grid gap-4 sm:grid-cols-3">
      <li
        v-for="project in projects"
        :key="project.id"
        class="p-4 bg-white rounded-lg shadow-sm border cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition"
        @click="handleProjectDetail(project.id)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <p class="text-xs text-gray-400">ID: {{ project.id.slice(0, 6) }}...</p>
            <h2 class="text-lg font-semibold text-gray-900 mt-2">{{ project.title }}</h2>
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="projectActioningId === project.id"
              class="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
              title="Edit project"
              @click.stop="openEditProject(project)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 20h9"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4z"
                ></path>
              </svg>
            </button>
            <button
              :disabled="projectActioningId === project.id"
              class="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 cursor-pointer disabled:opacity-50"
              title="Delete project"
              @click.stop="openDeleteProject(project)"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-3 0h14"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <p class="text-xs text-gray-500 mt-1">Created: {{ formatDateShort(project.createdAt) }}</p>

        <div class="flex items-center gap-2 mt-2 text-xs font-medium">
          <span class="px-2 py-1 rounded-full border" :class="statusClasses(project.status)">
            {{ project.status }}
          </span>
          <span class="px-2 py-1 rounded-full border" :class="priorityClasses(project.priority)">
            {{ project.priority }}
          </span>
        </div>
      </li>
    </ul>

    <!-- MODAL -->
    <CreateProjectModal
      v-if="showProjectModal"
      :project="editingProject"
      @close="closeProjectModal"
      @created="handleProjectCreated"
      @updated="handleProjectUpdated"
    />

    <ConfirmDeleteModal
      v-if="showConfirmDeleteModal"
      entity-label="project"
      :item-name="confirmDeleteProject ? confirmDeleteProject.title : ''"
      title="Delete project"
      description="Are you sure you want to delete this project? This action cannot be undone."
      confirm-label="Delete"
      :loading="!!confirmDeleteProject && projectActioningId === confirmDeleteProject.id"
      :confirm-disabled="!confirmDeleteProject"
      @close="closeConfirmDeleteModal"
      @confirm="confirmDeleteProjectAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { deleteProject, getProjects } from "../services/projectService";
import { priorityClasses, statusClasses } from "../helpers/projectBadgeClasses";
import { formatDateShort } from "../helpers/formatDates";
import type { IProject } from "../types/types";
import CreateProjectModal from "../components/CreateProjectModal.vue";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal.vue";
import { useToast } from "../composables/useToast";
import { isHandledError } from "../helpers/isHandledError";

const loading = ref(true);
const projects = ref<IProject[]>([]);
const showProjectModal = ref(false);
const showConfirmDeleteModal = ref(false);
const editingProject = ref<IProject | null>(null);
const confirmDeleteProject = ref<IProject | null>(null);
const projectActioningId = ref<string | null>(null);

const router = useRouter();

// Load projects on enter
onMounted(async () => {
  try {
    projects.value = await getProjects();
  } catch (err: unknown) {
    if (!isHandledError(err)) {
      const message = err instanceof Error ? err.message : "Could not load projects.";
      useToast().error(message);
    }
  } finally {
    loading.value = false;
  }
});

function handleProjectCreated(project: IProject) {
  projects.value.unshift(project);
  closeProjectModal();
}

function handleProjectUpdated(project: IProject) {
  const idx = projects.value.findIndex((p) => p.id === project.id);
  if (idx !== -1) {
    projects.value.splice(idx, 1, project);
  }
  closeProjectModal();
}

function handleProjectDetail(id: string) {
  router.push(`/app/projects/${id}`);
}

function openCreateProject() {
  editingProject.value = null;
  showProjectModal.value = true;
}

function openEditProject(project: IProject) {
  editingProject.value = project;
  showProjectModal.value = true;
}

function closeProjectModal() {
  showProjectModal.value = false;
  editingProject.value = null;
}

function openDeleteProject(project: IProject) {
  confirmDeleteProject.value = project;
  showConfirmDeleteModal.value = true;
}

function closeConfirmDeleteModal() {
  showConfirmDeleteModal.value = false;
  confirmDeleteProject.value = null;
}

async function confirmDeleteProjectAction() {
  if (!confirmDeleteProject.value) return;
  const project = confirmDeleteProject.value;
  projectActioningId.value = project.id;
  try {
    await deleteProject(project.id);
    projects.value = projects.value.filter((p) => p.id !== project.id);
    useToast().success("Project deleted successfully");
  } catch (err: unknown) {
    if (!isHandledError(err)) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      useToast().error(message);
    }
  } finally {
    projectActioningId.value = null;
    closeConfirmDeleteModal();
  }
}
</script>
