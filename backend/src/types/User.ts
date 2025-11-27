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