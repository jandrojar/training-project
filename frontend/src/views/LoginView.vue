<template>
  <div class="flex justify-center bg-gray-50 py-10">
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <input
          v-model="user.email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          v-model="user.password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Login
        </button>
      </form>

      <p class="text-center text-sm mt-4">
        Don't have an account yet?
        <router-link to="/register" class="text-blue-600 hover:underline">
          Sign up here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'
import { useSessionStore } from '../stores/session'
import type { IUserLogin } from '../types/types'
import { useToast } from '../composables/useToast'

const user = reactive<IUserLogin>({
  email: '',
  password: ''
})

const router = useRouter()
const sessionStore = useSessionStore()

async function handleLogin() {
  try {
    const response = await login(user)

    sessionStore.setSession(response)

    router.push('/app/dashboard')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    useToast().error(message)
  }
}
</script>
