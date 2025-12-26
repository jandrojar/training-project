<template>
  <div class="w-full flex flex-col gap-10">
    <section class="pt-14 pb-10 px-6 bg-gray-50">
      <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div class="space-y-6 text-left">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold">
            Fast-track your projects
          </span>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Manage projects without friction.
          </h1>
          <p class="text-lg text-gray-700">
            Plan, assign, and track in one place. Clear boards, visible ownership, and live status so your team ships faster.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <router-link
              to="/register"
              class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
            >
              Start for free
            </router-link>
            <router-link
              to="/login"
              class="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition cursor-pointer"
            >
              I already have an account
            </router-link>
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-green-500"></span>
              <span>Onboard your team in minutes</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-blue-500"></span>
              <span>Unlimited team invites</span>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 bg-blue-100 rounded-3xl blur-3xl opacity-60"></div>
          <div class="relative bg-white rounded-3xl shadow-xl overflow-hidden">
            <img :src="heroImage" alt="Project management illustration" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
  </section>
</div>
</template>

<script setup lang="ts">
import heroImage from '../assets/project-management.jpg'
</script>
