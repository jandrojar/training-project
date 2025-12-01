<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- Top navigation -->
    <header class="w-full h-16 border-b flex items-center justify-between px-6">
      <h1 class="text-xl font-semibold tracking-tight">Training App</h1>

      <!-- Placeholder for user menu -->
      <div class="text-gray-600">User</div>
    </header>

    <!-- Main content -->
    <main class="flex-1 p-6 bg-gray-50">
      <router-view />
    </main>
  </div>
</template>
