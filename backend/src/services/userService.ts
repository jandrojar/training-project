import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import type { UserRegister, UserDTO, UserUpdate, UserPasswordUpdateInput } from "../types/User";
import { BadRequestError, ConflictError, NotFoundError } from "../errors/AppError";

const userRepo = new UserRepository();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function registerUser(user: UserRegister): Promise<UserDTO> {
  // --- Basic validations ---
  if (user.password.length < 6) {
    throw new BadRequestError("Password must be at least 6 characters long", "weak-password");
  }

  if (!EMAIL_RE.test(user.email)) {
    throw new BadRequestError("Invalid email address", "invalid-email");
  }

  const duplicatedEmail = await userRepo.findByEmail(user.email);
  if (duplicatedEmail) {
    throw new ConflictError("This email is already in use", "email-in-use");
  }

  if (
    user.name.length > 50 ||
    (user.lastname && user.lastname.length > 50) ||
    user.email.length > 50
  ) {
    throw new BadRequestError("This input field cannot exceed 50 characters", "field-too-long");
  }

  if (user.age !== undefined && user.age !== null && (user.age < 18 || user.age >= 120)) {
    throw new BadRequestError("Age must be between 18 and 120 years old", "invalid-age");
  }

  // --- Hash password ---
  const hashedPassword = await bcrypt.hash(user.password, 10);

  // --- Persist in DB ---
  const createdUser = await userRepo.create({
    ...user,
    password: hashedPassword,
  });

  // --- Build DTO ---
  return {
    id: createdUser.id,
    name: createdUser.name,
    lastname: createdUser.lastname ?? undefined,
    age: createdUser.age ?? undefined,
    email: createdUser.email,
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
    email: user.email,
  };
}

export async function updateUser(userId: string, user: UserUpdate): Promise<UserDTO> {
  if (user.email && !EMAIL_RE.test(user.email)) {
    throw new BadRequestError("Invalid email address", "invalid-email");
  }

  if (user.email) {
    const duplicatedEmail = await userRepo.findByEmail(user.email);
    if (duplicatedEmail && duplicatedEmail.id !== userId) {
      throw new ConflictError("This email is already in use", "email-in-use");
    }
  }

  if (
    (user.name && user.name.length > 50) ||
    (user.lastname && user.lastname.length > 50) ||
    (user.email && user.email.length > 50)
  ) {
    throw new BadRequestError("This input field cannot exceed 50 characters", "field-too-long");
  }

  if (user.age !== undefined && user.age !== null && (user.age < 18 || user.age >= 120)) {
    throw new BadRequestError("Age must be between 18 and 120 years old", "invalid-age");
  }

  const updatedUser = await userRepo.update(userId, user);

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    lastname: updatedUser.lastname ?? undefined,
    age: updatedUser.age ?? undefined,
    email: updatedUser.email,
  };
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (newPassword.length < 6) {
    throw new BadRequestError("New password must be at least 6 characters long", "weak-password");
  }

  const user = await userRepo.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found", "user-not-found");
  }

  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    throw new BadRequestError("Current password is incorrect", "invalid-current-password");
  }

  if (currentPassword === newPassword) {
    throw new BadRequestError(
      "New password cannot be the same as the current password",
      "password-unchanged",
    );
  }

  const payload: UserPasswordUpdateInput = {
    password: await bcrypt.hash(newPassword, 10),
  };

  await userRepo.updatePassword(userId, payload);
}

export async function deleteUser(userId: string): Promise<void> {
  await userRepo.delete(userId);
}
