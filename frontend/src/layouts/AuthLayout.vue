<template>
  <div class="min-h-screen flex flex-col bg-gray-50">

    <!-- Header -->
    <header class="py-6 text-center">
      <h1 class="text-3xl font-bold text-gray-800">Training App</h1>
    </header>

    <!-- Contenido centrado pero sin empujar demasiado -->
    <main class="flex-1 flex justify-center items-start pt-10 px-4">
      <router-view />
    </main>

  </div>
</template>
