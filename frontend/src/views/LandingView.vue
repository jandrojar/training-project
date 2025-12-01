<template>
  <div class="text-center space-y-6 pt-10">
    <h2 class="text-4xl font-bold text-gray-800">Welcome</h2>
    <p class="text-gray-600">Start managing your projects easily.</p>

    <div class="space-x-4">
      <router-link
        to="/login"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
      >
        Log in
      </router-link>

      <router-link
        to="/register"
        class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
      >
        Sign up
      </router-link>
    </div>
  </div>
</template>
