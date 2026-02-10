<template>
    <div class="space-y-6 max-w-5xl mx-auto">
        <div>
            <p class="text-sm uppercase tracking-wide text-gray-400">Settings</p>
            <h1 class="text-3xl font-bold text-gray-900">User Settings</h1>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Update Profile</h2>
            <div v-if="loading" class="text-center text-gray-600">Loading...</div>
            <form v-else class="space-y-4" @submit.prevent="updateUser">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="name">Name</label>
                    <input v-model="form.name" id="name" type="text" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="lastname">Last Name</label>
                    <input v-model="form.lastname" id="lastname" type="text" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="age">Age</label>
                    <input v-model.number="form.age" id="age" type="number" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="email">Email</label>
                    <input v-model="form.email" id="email" type="email" required class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                </div>
                <button type="submit" :disabled="!hasChanges" class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer disabled:opacity-50">
                    Update Profile
                </button>
            </form>
        </div>
        <div class="w-full p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold mb-6 text-gray-900">Change Password</h2>
            <form class="space-y-4" @submit.prevent="updateUserPassword">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="currentPassword">Current Password</label>
                    <div class="relative">
                        <input
                            v-model="passwordForm.currentPassword"
                            id="currentPassword"
                            :type="showCurrentPassword ? 'text' : 'password'"
                            required
                            class="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 px-3 text-blue-600 hover:text-blue-700 cursor-pointer flex items-center"
                            @click="showCurrentPassword = !showCurrentPassword"
                            :aria-label="showCurrentPassword ? 'Hide current password' : 'Show current password'"
                        >
                            <svg
                                v-if="showCurrentPassword"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.58 10.58a2 2 0 102.83 2.83" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 5.09A9.77 9.77 0 0112 4.8c5.05 0 9.27 3.11 10.5 7.2a10.9 10.9 0 01-3.02 4.73M6.61 6.61A10.87 10.87 0 001.5 12c1.23 4.09 5.45 7.2 10.5 7.2 1.94 0 3.76-.46 5.36-1.27" />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.5 12c1.23-4.09 5.45-7.2 10.5-7.2s9.27 3.11 10.5 7.2c-1.23 4.09-5.45 7.2-10.5 7.2S2.73 16.09 1.5 12z" />
                                <circle cx="12" cy="12" r="3" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="newPassword">New Password</label>
                    <div class="relative">
                        <input
                            v-model="passwordForm.newPassword"
                            id="newPassword"
                            :type="showNewPassword ? 'text' : 'password'"
                            required
                            class="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 px-3 text-blue-600 hover:text-blue-700 cursor-pointer flex items-center"
                            @click="showNewPassword = !showNewPassword"
                            :aria-label="showNewPassword ? 'Hide new password' : 'Show new password'"
                        >
                            <svg
                                v-if="showNewPassword"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.58 10.58a2 2 0 102.83 2.83" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 5.09A9.77 9.77 0 0112 4.8c5.05 0 9.27 3.11 10.5 7.2a10.9 10.9 0 01-3.02 4.73M6.61 6.61A10.87 10.87 0 001.5 12c1.23 4.09 5.45 7.2 10.5 7.2 1.94 0 3.76-.46 5.36-1.27" />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.5 12c1.23-4.09 5.45-7.2 10.5-7.2s9.27 3.11 10.5 7.2c-1.23 4.09-5.45 7.2-10.5 7.2S2.73 16.09 1.5 12z" />
                                <circle cx="12" cy="12" r="3" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-2" for="confirmPassword">Confirm New Password</label>
                    <div class="relative">
                        <input
                            v-model="passwordForm.confirmPassword"
                            id="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            required
                            class="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                        <button
                            type="button"
                            class="absolute inset-y-0 right-0 px-3 text-blue-600 hover:text-blue-700 cursor-pointer flex items-center"
                            @click="showConfirmPassword = !showConfirmPassword"
                            :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                        >
                            <svg
                                v-if="showConfirmPassword"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.58 10.58a2 2 0 102.83 2.83" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 5.09A9.77 9.77 0 0112 4.8c5.05 0 9.27 3.11 10.5 7.2a10.9 10.9 0 01-3.02 4.73M6.61 6.61A10.87 10.87 0 001.5 12c1.23 4.09 5.45 7.2 10.5 7.2 1.94 0 3.76-.46 5.36-1.27" />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                class="w-5 h-5"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1.5 12c1.23-4.09 5.45-7.2 10.5-7.2s9.27 3.11 10.5 7.2c-1.23 4.09-5.45 7.2-10.5 7.2S2.73 16.09 1.5 12z" />
                                <circle cx="12" cy="12" r="3" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                </div>
                <button type="submit" class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    Update Password
                </button>
            </form>
        </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-sm border border-red-100 space-y-4">
            <div>
                <p class="text-sm uppercase tracking-wide text-red-500">Danger Zone</p>
                <h2 class="text-2xl font-bold text-gray-900">Delete Account</h2>
                <p class="text-sm text-gray-600 mt-1">
                    This will permanently remove your account and related data.
                </p>
            </div>
            <button
                @click="showConfirmDeleteModal = true"
                class="w-full sm:w-auto px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer shadow-sm"
            >
                Delete Account
            </button>
        </div>

        <ConfirmDeleteModal
            v-if="showConfirmDeleteModal"
            entityLabel="account"
            title="Delete account"
            description="Are you sure you want to delete your account? This action cannot be undone."
            confirmLabel="Delete"
            @close="closeConfirmDeleteModal"
            @confirm="confirmDeleteUserAction"
        />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { getCurrentUser, updateCurrentUser, updateCurrentUserPassword, deleteCurrentUser } from '../services/userService';
import type { IUser, IUserUpdate, IUserPasswordUpdate } from '../types/types';
import { useToast } from '../composables/useToast';
import { isHandledError } from '../helpers/isHandledError';
import { useUserStore } from '../stores/user';
import { useSessionStore } from '../stores/session';
import { useRouter } from 'vue-router';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';

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

const passwordForm = reactive<IUserPasswordUpdate & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const showConfirmDeleteModal = ref(false);

const userStore = useUserStore();
const sessionStore = useSessionStore();

const router = useRouter();

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

async function updateUserPassword() {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        useToast().error("New password and confirmation do not match");
        return;
    }
    try {
        const res = await updateCurrentUserPassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
        });
        useToast().success(res.message || "Password updated successfully");
        // Clear password fields after successful update
        passwordForm.currentPassword = '';
        passwordForm.newPassword = '';
        passwordForm.confirmPassword = '';
    } catch (error: unknown) {
        if (!isHandledError(error)) {
            const message = error instanceof Error ? error.message : "Failed to update password"
            useToast().error(message)
        }
    }
}

async function confirmDeleteUserAction() {
    try {
        await deleteCurrentUser();
        useToast().success("Account deleted successfully");
        userStore.clearCurrentUser();
        sessionStore.clearSession();
        router.push('/');
    } catch (error: unknown) {
        if (!isHandledError(error)) {
            const message = error instanceof Error ? error.message : "Failed to delete account"
            useToast().error(message)
        }
    } finally {
        closeConfirmDeleteModal();
    }
}

function closeConfirmDeleteModal() {
    showConfirmDeleteModal.value = false;
}
</script>
