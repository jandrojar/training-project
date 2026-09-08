import { Context } from "koa";
import {
  registerUser,
  getUserById,
  updateUser,
  updateUserPassword,
  deleteUser,
} from "../services/userService";
import type { UserRegister, UserUpdate } from "../types/User";
import { BadRequestError, NotFoundError } from "../errors/AppError";

export async function registerHandler(ctx: Context) {
  const { name, lastname, age, email, password } = ctx.request.body as UserRegister;

  const cleanName = name?.trim();
  const cleanEmail = email?.trim();
  const cleanPassword = password?.trim();
  const cleanLastname = lastname && lastname.trim() !== "" ? lastname.trim() : undefined;

  if (!cleanName || !cleanEmail || !cleanPassword) {
    throw new BadRequestError("Missing required fields", "missing-fields");
  }

  if (age !== undefined && typeof age !== "number") {
    throw new BadRequestError("Age must be a number", "invalid-age");
  }

  const newUser = await registerUser({
    name: cleanName,
    lastname: cleanLastname,
    age,
    email: cleanEmail,
    password: cleanPassword,
  });

  ctx.status = 201;
  ctx.body = newUser;
}

export async function getCurrentUserHandler(ctx: Context) {
  const user = await getUserById(ctx.state.userId);

  if (!user) {
    throw new NotFoundError("User not found", "user-not-found");
  }

  ctx.body = user;
}

export async function updateCurrentUserHandler(ctx: Context) {
  const body = ctx.request.body as Partial<UserUpdate>;
  const { name, lastname, age, email } = body;

  const cleanName = name?.trim();
  const cleanEmail = email?.trim();
  const hasLastname = Object.prototype.hasOwnProperty.call(body, "lastname");
  const hasAge = Object.prototype.hasOwnProperty.call(body, "age");

  if (name !== undefined && !cleanName) {
    throw new BadRequestError("Name cannot be empty", "invalid-name");
  }

  if (email !== undefined && !cleanEmail) {
    throw new BadRequestError("Email cannot be empty", "invalid-email");
  }

  if (lastname !== undefined && lastname !== null && typeof lastname !== "string") {
    throw new BadRequestError("Lastname must be a string", "invalid-lastname");
  }

  if (age !== undefined && age !== null && typeof age !== "number") {
    throw new BadRequestError("Age must be a number", "invalid-age");
  }

  const data: UserUpdate = {};
  if (cleanName !== undefined) data.name = cleanName;
  if (hasLastname) {
    data.lastname = typeof lastname === "string" && lastname.trim() !== "" ? lastname.trim() : null;
  }
  if (hasAge) data.age = age === null ? null : age;
  if (cleanEmail !== undefined) data.email = cleanEmail;

  ctx.body = await updateUser(ctx.state.userId, data);
}

export async function updatePasswordHandler(ctx: Context) {
  const { currentPassword, newPassword } = ctx.request.body as {
    currentPassword?: unknown;
    newPassword?: unknown;
  };

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    throw new BadRequestError("Passwords must be strings", "invalid-password");
  }

  const cleanCurrentPassword = currentPassword.trim();
  const cleanNewPassword = newPassword.trim();

  if (!cleanCurrentPassword || !cleanNewPassword) {
    throw new BadRequestError("Missing required fields", "missing-fields");
  }

  await updateUserPassword(ctx.state.userId, cleanCurrentPassword, cleanNewPassword);
  ctx.body = { message: "Password updated successfully" };
}

export async function deleteCurrentUserHandler(ctx: Context) {
  await deleteUser(ctx.state.userId);
  ctx.status = 204;
}
