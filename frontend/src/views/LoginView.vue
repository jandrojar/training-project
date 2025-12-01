<template>
  <div class="flex justify-center bg-gray-50 py-10">
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow">
      <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>

      <form class="space-y-4">
        <input
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          class="w-full px-4 py-2 border rounded-lg"
        />

        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
</template>
