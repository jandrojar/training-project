import { api } from "./api";
import type { IUserRegisterResponse } from '../types/types';

export async function getCurrentUser(): Promise<IUserRegisterResponse> {
    const res = await api.get('/users/me');
    return res.data;
}