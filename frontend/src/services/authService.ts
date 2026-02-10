import { api } from "./api";
import type {IUserLogin, IUserRegister,IAuthResponse, IUser} from '../types/types';

// Errors are normalized in the axios interceptor.

export async function login(data: IUserLogin): Promise<IAuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data;
}

export async function register(data: IUserRegister): Promise<IUser>{
    const res = await api.post('/users/register', data);
    return res.data;
}

export async function logout(): Promise<{ success: boolean }> {
  const res = await api.post('/auth/logout')
  return res.data
}
