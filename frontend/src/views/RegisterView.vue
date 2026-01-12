<template>
  <div class="flex justify-center bg-gray-50 py-10">
    <div class="w-full max-w-md p-6 bg-white rounded-xl shadow">
      <h1 class="text-3xl font-bold mb-6 text-center">Create your account</h1>

      <form @submit.prevent="handleRegister"  class="space-y-4">
        <!-- First name -->
        <input 
          v-model="user.name"
          type="text"
          placeholder="First name"
          class="w-full px-4 py-2 border rounded-lg"
          required
        />

        <!-- Last name -->
        <input
          v-model="user.lastname"
          type="text"
          placeholder="Last name (optional)"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Age -->
        <input
          v-model.number="user.age"
          type="number"
          placeholder="Age (optional)"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Email -->
        <input 
          v-model="user.email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg"
          required
        />

        <!-- Password -->
        <input 
          v-model="user.password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg"
          required
        />

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Sign up
        </button>
      </form>

      <p class="text-center text-sm mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import type { IUserRegister } from '../types/types';
import { useRouter } from 'vue-router';
import { register } from '../services/authService'
import { useToast } from '../composables/useToast'

const router = useRouter();
const user = reactive<IUserRegister>({
  name: '',
  lastname: '',
  age: undefined,
  email: '',
  password: ''
});

async function handleRegister() {
  try{
    await register(user)
    useToast().success('Account created. Please log in.')
    router.push('/login')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Register failed"
    useToast().error(message)
  }
}


</script>
