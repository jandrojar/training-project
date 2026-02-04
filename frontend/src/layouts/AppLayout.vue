<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Top navigation -->
    <header class="w-full h-16 border-b flex items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <img src="../assets/Logo.svg" alt="Project Manager App logo" class="h-15 w-auto" />
      </div>

      <div class="flex items-center gap-4">
        <!-- Placeholder for user menu -->
        <router-link to="/app/profile" class="flex items-center gap-2 text-gray-600">
          <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" stroke-width="1.5" />
            <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span>{{userStore.currentUser?.name ?? "User"}}</span>
        </router-link>
        <button @click="handleLogout" type="button" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
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
import { useRouter } from 'vue-router';
import { logout } from '../services/authService';
import { useSessionStore } from '../stores/session';
import { useUserStore } from '../stores/user';
import { useToast } from '../composables/useToast';
import { isHandledError } from '../helpers/isHandledError';
import { getCurrentUser } from '../services/userService';
import type { IUser } from '../types/types';
import {  onMounted } from 'vue';

const router = useRouter();
const session = useSessionStore();
const userStore = useUserStore();

onMounted(async () => {
  try {
    if(userStore.currentUser) return; // Avoid refetching if already loaded
    const user: IUser =  await getCurrentUser();
    userStore.setCurrentUser(user);
  } catch (error: unknown) {
    if (!isHandledError(error)) {
      const message = error instanceof Error ? error.message : "Failed to fetch user data"
      useToast().error(message)
    }
  }
});


async function handleLogout() {
  try{
    await logout();
    session.clearSession();
    userStore.clearCurrentUser();
    useToast().success("Logged out successfully")
    router.push('/login');
  } catch (error: unknown) {
    if (!isHandledError(error)) {
      const message = error instanceof Error ? error.message : "Logout failed"
      useToast().error(message)
    }
  }
  
}

</script>
