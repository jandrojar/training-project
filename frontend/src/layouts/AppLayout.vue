<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Top navigation -->
    <header class="w-full h-16 border-b flex items-center justify-between px-6">
      <div class="flex items-center gap-3">
        <img src="../assets/Logo.svg" alt="Project Manager App logo" class="h-15 w-auto" />
      </div>

      <!-- Placeholder for user menu -->
      <div class="text-gray-600">User</div>
      <button @click="handleLogout"  type="button" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
        Logout
      </button>
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
import { useToast } from '../composables/useToast';

const router = useRouter();
const session = useSessionStore();

async function handleLogout() {
  try{
    await logout();
    session.clearSession();
    useToast().success("Logged out successfully")
    router.push('/login');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout failed"
    useToast().error(message)
  }
  
}

</script>
