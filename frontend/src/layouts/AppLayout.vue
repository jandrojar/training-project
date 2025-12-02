<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Top navigation -->
    <header class="w-full h-16 border-b flex items-center justify-between px-6">
      <h1 class="text-xl font-semibold tracking-tight">Training App</h1>

      <!-- Placeholder for user menu -->
      <div class="text-gray-600">User</div>
      <button @click="handleLogout"  type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
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

const router = useRouter();
const session = useSessionStore();

async function handleLogout() {
  try{
    await logout();
    session.clearSession();
    router.push('/login');
  } catch (error: any) {
    alert(error?.error || "Logout failed")
  }
  
}

</script>
