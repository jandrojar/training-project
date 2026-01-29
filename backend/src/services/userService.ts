import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import type { UserRegister, UserDTO, UserUpdate } from "../types/User";

const userRepo = new UserRepository();

export async function registerUser(user: UserRegister): Promise<UserDTO> {
    // --- Basic validations ---
    if (user.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        throw new Error("Invalid email address");
    }

    const duplicatedEmail = await userRepo.findByEmail(user.email);
    if (duplicatedEmail) {
        throw new Error("This email is already in use");
    }

    if (user.name.length > 50 || (user.lastname && user.lastname.length > 50) || user.email.length > 50) {
        throw new Error("This input field cannot exceed 50 characters");
    }

    if (user.age !== undefined && (user.age < 18 || user.age >= 120)) {
        throw new Error("Age must be between 18 and 120 years old");
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // --- Persist in DB ---
    const createdUser = await userRepo.create({
        ...user,
        password: hashedPassword
    });

    // --- Build DTO ---
    return {
        id: createdUser.id,
        name: createdUser.name,
        lastname: createdUser.lastname ?? undefined,
        age: createdUser.age ?? undefined,
        email: createdUser.email
    };
}

export async function getUserById(userId: string): Promise<UserDTO | null> {
    const user = await userRepo.findById(userId);
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        name: user.name,
        lastname: user.lastname ?? undefined,
        age: user.age ?? undefined,
        email: user.email
    };
}

export async function updateUser(userId: string, user: UserUpdate): Promise<UserDTO> {

    if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)){
        throw new Error("Invalid email address");
    } 

    if (user.email) {
        const duplicatedEmail = await userRepo.findByEmail(user.email);
        if (duplicatedEmail && duplicatedEmail.id !== userId) {
            throw new Error("This email is already in use");
        }
    }

    if (user.name && user.name.length > 50 || (user.lastname && user.lastname.length > 50) || (user.email && user.email.length > 50)) {
        throw new Error("This input field cannot exceed 50 characters");
    }
    
    if (user.age !== undefined && (user.age < 18 || user.age >= 120)) {
        throw new Error("Age must be between 18 and 120 years old");
    }

    const updatedUser = await userRepo.update(userId, user);

    return {
        id: updatedUser.id,
        name: updatedUser.name,
        lastname: updatedUser.lastname ?? undefined,
        age: updatedUser.age ?? undefined,
        email: updatedUser.email
    };
    
}