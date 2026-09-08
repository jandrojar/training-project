<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Top navigation -->
    <header class="w-full border-b bg-white">
      <div class="h-16 px-4 sm:px-6 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <router-link to="/app/dashboard" class="flex items-center">
            <img src="../assets/Logo.svg" alt="Project Manager App logo" class="h-12 w-auto" />
          </router-link>

          <nav class="hidden md:flex items-center gap-2">
            <router-link
              to="/app/dashboard"
              class="px-3 py-2 rounded-lg text-sm font-medium transition"
              :class="
                route.path === '/app/dashboard'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              Dashboard
            </router-link>
            <router-link
              to="/app/profile"
              class="px-3 py-2 rounded-lg text-sm font-medium transition"
              :class="
                route.path === '/app/profile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              "
            >
              Profile
            </router-link>
          </nav>
        </div>

        <div class="hidden md:flex items-center gap-3">
          <button
            type="button"
            class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            @click="toggleUserMenu"
          >
            <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M4 20a8 8 0 0 1 16 0"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span class="max-w-40 truncate">{{ userStore.currentUser?.name ?? "User" }}</span>
            <svg
              class="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-6 top-14 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-20"
          >
            <router-link
              to="/app/profile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              @click="showUserMenu = false"
            >
              Profile
            </router-link>
            <button
              type="button"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>

        <button
          type="button"
          class="md:hidden p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
          aria-label="Toggle navigation menu"
          @click="showMobileMenu = !showMobileMenu"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div v-if="showMobileMenu" class="md:hidden border-t px-4 py-3 space-y-2">
        <router-link
          to="/app/dashboard"
          class="block px-3 py-2 rounded-lg text-sm font-medium"
          :class="
            route.path === '/app/dashboard'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          "
          @click="showMobileMenu = false"
        >
          Dashboard
        </router-link>
        <router-link
          to="/app/profile"
          class="block px-3 py-2 rounded-lg text-sm font-medium"
          :class="
            route.path === '/app/profile'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          "
          @click="showMobileMenu = false"
        >
          Profile
        </router-link>
        <button
          type="button"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-6 bg-gray-50">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { logout } from "../services/authService";
import { useSessionStore } from "../stores/session";
import { useUserStore } from "../stores/user";
import { useToast } from "../composables/useToast";
import { isHandledError } from "../helpers/isHandledError";
import { getCurrentUser } from "../services/userService";
import type { IUser } from "../types/types";

const router = useRouter();
const route = useRoute();
const session = useSessionStore();
const userStore = useUserStore();
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

onMounted(async () => {
  try {
    if (userStore.currentUser) return; // Avoid refetching if already loaded
    const user: IUser = await getCurrentUser();
    userStore.setCurrentUser(user);
  } catch (error: unknown) {
    if (!isHandledError(error)) {
      const message = error instanceof Error ? error.message : "Failed to fetch user data";
      useToast().error(message);
    }
  }
});

async function handleLogout() {
  try {
    await logout();
    session.clearSession();
    userStore.clearCurrentUser();
    showUserMenu.value = false;
    showMobileMenu.value = false;
    useToast().success("Logged out successfully");
    router.push("/login");
  } catch (error: unknown) {
    if (!isHandledError(error)) {
      const message = error instanceof Error ? error.message : "Logout failed";
      useToast().error(message);
    }
  }
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}
</script>
