<template>
    <div class="flex justify-center bg-gray-50 py-10">
        <div class="w-full max-w-md p-6 bg-white rounded-xl shadow">
            <h1 class="text-3xl font-bold mb-6 text-center">User Profile</h1>
            <div v-if="loading" class="text-center text-gray-600">Loading...</div>
            <form v-else class="space-y-4" @submit.prevent="updateUser">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="name">Name:</label>
                    <input v-model="form.name" id="name" type="text" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="lastname">Last Name:</label>
                    <input v-model="form.lastname" id="lastname" type="text" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="age">Age:</label>
                    <input v-model.number="form.age" id="age" type="number" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="email">Email:</label>
                    <input v-model="form.email" id="email" type="email" required class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <button type="submit" :disabled="!hasChanges" class="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
                    Update Profile
                </button>
            </form>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { getCurrentUser, updateCurrentUser } from '../services/userService';
import type { IUser, IUserUpdate } from '../types/types';
import { useToast } from '../composables/useToast';
import { isHandledError } from '../helpers/isHandledError';
import { useUserStore } from '../stores/user';

const loading = ref(true);
const form = reactive<{
  name: string;
  lastname: string;
  age?: number;
  email: string;
}>({
  name: '',
  lastname: '',
  age: undefined,
  email: ''
})
const originalUser = ref<IUser | null>(null); // Snapshot of original user data
const userStore = useUserStore();

function normalizeAge(value: unknown): number | null {
    return typeof value === "number" && !Number.isNaN(value) ? value : null;
}



onMounted(async () => {
    try {
        originalUser.value = await getCurrentUser();
        form.name = originalUser.value.name;
        form.lastname = originalUser.value.lastname || '';
        form.age = originalUser.value.age ?? undefined;
        form.email = originalUser.value.email;
    } catch (error: unknown) {
        if (!isHandledError(error)) {
            const message = error instanceof Error ? error.message : "Failed to fetch user data"
            useToast().error(message)
        }
    } finally {
        loading.value = false;
    }
});

const hasChanges = computed(() => {
    if (!originalUser.value) return false;
    const normalizedAge = normalizeAge(form.age);
    const originalAge = originalUser.value.age ?? null;
    return (
        form.name !== originalUser.value.name ||
        form.lastname !== (originalUser.value.lastname || '') ||
        normalizedAge !== originalAge ||
        form.email !== originalUser.value.email
    );
});


async function updateUser() {
    if (!hasChanges.value) {
        useToast().info("No changes to update");
        return;
    }
    if (!form.name.trim()) {
        useToast().error("Name cannot be empty");
        return;
    }
    if (!form.email.trim()) {
        useToast().error("Email cannot be empty");
        return;
    }
    const normalizedAge = normalizeAge(form.age);
    const originalAge = originalUser.value?.age ?? null;
    const payload: IUserUpdate = {} ;
    if (form.name !== originalUser.value?.name) payload.name = form.name.trim();
    if (form.lastname !== (originalUser.value?.lastname || '')) payload.lastname = form.lastname.trim();
    if (normalizedAge !== originalAge) payload.age = normalizedAge;
    if (form.email !== originalUser.value?.email) payload.email = form.email.trim()
    try {
        const updatedUser = await updateCurrentUser(payload);
        originalUser.value = updatedUser;
        form.name = updatedUser.name;
        form.lastname = updatedUser.lastname ?? '';
        form.age = updatedUser.age ?? undefined;
        form.email = updatedUser.email;
        useToast().success("Profile updated successfully");
        userStore.setCurrentUser(updatedUser);
    } catch (error: unknown) {
        if (!isHandledError(error)) {
            const message = error instanceof Error ? error.message : "Failed to update user data"
            useToast().error(message)
        }
    }
}
</script>
