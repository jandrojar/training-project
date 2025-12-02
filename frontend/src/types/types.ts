export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegister{
    name:string,
    lastname?:string,
    age?:number,
    email:string,
    password:string
}

export interface IAuthResponse {
    sessionId:string,
    expiresAt: string,
    userId: string
}

export interface IUserRegisterResponse{
    id: string,
    name:string,
    lastname?:string,
    age?:number,
    email:string
}

export interface IProject {
  id: string
  title: string
  userId: string
  createdAt: string
  updatedAt: string
}