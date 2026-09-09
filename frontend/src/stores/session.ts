import { defineStore } from "pinia";
import type { IAuthResponse } from "../types/types";

interface SessionState {
  userId: string | null;
  sessionId: string | null;
  expiresAt: string | null;
}

export const useSessionStore = defineStore("session", {
  state: (): SessionState => ({
    userId: null,
    sessionId: null,
    expiresAt: null,
  }),

  getters: {
    isLoggedIn: (state) =>
      Boolean(state.sessionId && state.expiresAt && new Date(state.expiresAt) > new Date()),
  },

  actions: {
    // Set session after login
    setSession(data: IAuthResponse) {
      this.userId = data.userId;
      this.sessionId = data.sessionId;
      this.expiresAt = data.expiresAt;

      localStorage.setItem("session", JSON.stringify(data));
    },

    // Load session from localStorage on app startup
    loadSession() {
      const raw = localStorage.getItem("session");
      if (!raw) return;

      let data: IAuthResponse;
      try {
        data = JSON.parse(raw) as IAuthResponse;
      } catch {
        this.clearSession();
        return;
      }

      // Drop anything malformed or already expired
      if (!data?.sessionId || !data?.expiresAt || new Date(data.expiresAt) < new Date()) {
        this.clearSession();
        return;
      }

      this.userId = data.userId;
      this.sessionId = data.sessionId;
      this.expiresAt = data.expiresAt;
    },

    // Logout
    clearSession() {
      this.userId = null;
      this.sessionId = null;
      this.expiresAt = null;

      localStorage.removeItem("session");
    },
  },
});
