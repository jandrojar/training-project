import { api } from "./api";
import type { IUser, IUserUpdate } from '../types/types';

export async function getCurrentUser(): Promise<IUser> {
    const res = await api.get('/users/me');
    return res.data;
}

export async function updateCurrentUser(payload: IUserUpdate): Promise<IUser> {
    const res = await api.patch('/users/me', payload);
    return res.data;
}