export interface UserRegister {
    name: string;
    lastname?: string;
    age?: number;
    email: string;
    password: string;
}

export interface UserDTO {
  id: string;
  name: string;
  lastname?: string;
  age?: number;
  email: string;
}

export interface UserUpdate {
  name?: string;
  lastname?: string;
  age?: number;
  email?: string;
}

export type UserCreateInput = {
  name: string;
  lastname?: string;
  age?: number;
  email: string;
  password: string;
}

export type UserUpdateInput = {
  name?: string;
  lastname?: string;
  age?: number;
  email?: string;
}

export type UserPasswordUpdateInput = {
  password: string; 
}
