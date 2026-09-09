import { defineStore } from "pinia";
import type { IUser } from "../types/types";

interface UserState {
  currentUser: IUser | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    currentUser: null,
  }),

  actions: {
    setCurrentUser(user: IUser) {
      this.currentUser = user;
    },
    clearCurrentUser() {
      this.currentUser = null;
    },
  },
});
