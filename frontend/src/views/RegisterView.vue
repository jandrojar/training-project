<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-xl shadow">
      <h1 class="text-3xl font-bold mb-6 text-center">Create your account</h1>

      <form class="space-y-4">
        <!-- First name -->
        <input 
          type="text"
          placeholder="First name"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Last name -->
        <input 
          type="text"
          placeholder="Last name (optional)"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Age -->
        <input
          type="number"
          placeholder="Age (optional)"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Email -->
        <input 
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Password -->
        <input 
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <!-- Submit -->
        <button
          type="submit"
          class="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Sign up
        </button>
      </form>

      <p class="text-center text-sm mt-4">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Log in
        </router-link>
      </p>
    </div>
  </div>
</template>
