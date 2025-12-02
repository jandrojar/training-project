import { api } from "./api";
import type {IUserLogin, IUserRegister,IAuthResponse, IUserRegisterResponse} from '../types/types';


export async function login(data: IUserLogin): Promise<IAuthResponse> {
    try{
        const res = await api.post('/auth/login', data);
        return res.data;
    } catch(err: any){
        throw err.response?.data || 'An unknown error ocurred.';
    
    }
}

export async function register(data: IUserRegister): Promise<IUserRegisterResponse>{
    try{
        const res = await api.post('/users/register', data);
        return res.data;
    }catch (err:any){
        throw err.response?.data || 'An unknown error ocurred.';
    }
}

export async function logout(): Promise<{ success: boolean }> {
  try {
    const res = await api.post('/auth/logout')
    return res.data
  } catch (err: any) {
    throw err.response?.data || "Logout failed"
  }
}