<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- Header -->
    <header class="w-full h-25 flex items-center justify-between px-6">
      <div class="flex justify-center items-center">
        <img src="../assets/Logo.svg" alt="Project Manager App logo" class="h-25 w-auto" />
      </div>

      <div v-if="route.meta.page === 'Landing'" class="space-x-4">
        <button @click="toLogin" type="button" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
          Login
        </button>
        <button @click="toSignUp" type="button" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer">
          Sign up
        </button>
      </div>

      <div v-else-if="route.meta.page === 'Login'" class="space-x-4">
        <button @click="toSignUp" type="button" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
          Sign up
        </button>
        <button @click="toLanding" type="button" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer">
          Home
        </button>
      </div>

      <div v-else class="space-x-4">
        <button @click="toLogin" type="button" class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
          Login
        </button>
        <button @click="toLanding" type="button" class="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition cursor-pointer">
          Home
        </button>
      </div>
    </header>

    <!-- Contenido centrado pero sin empujar demasiado -->
    <main class="flex-1 flex justify-center items-start pt-10 px-4">
      <router-view />
    </main>

  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { getCurrentUser } from '../services/userService';



const route = useRoute();
const router = useRouter();

console.log(getCurrentUser());

function toLogin() {
  router.push('/login');
}

function toSignUp() {
  router.push('/register');
}

function toLanding() {
  router.push('/');
}
</script>