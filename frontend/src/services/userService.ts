import { api } from "./api";
import type { IUser, IUserUpdate, IUserPasswordUpdate } from "../types/types";

export async function getCurrentUser(): Promise<IUser> {
  const res = await api.get("/users/me");
  return res.data;
}

export async function updateCurrentUser(payload: IUserUpdate): Promise<IUser> {
  const res = await api.patch("/users/me", payload);
  return res.data;
}

export async function updateCurrentUserPassword(
  payload: IUserPasswordUpdate,
): Promise<{ message: string }> {
  const res = await api.patch("/users/me/password", payload);
  return res.data;
}

export async function deleteCurrentUser(): Promise<void> {
  await api.delete("/users/me");
}
