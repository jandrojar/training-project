import { Context } from "koa";
import { registerUser, getUserById, updateUser } from "../services/userService";
import type { UserRegister, UserUpdate } from "../types/User";

export async function registerHandler(ctx: Context) {
    const { name, lastname, age, email, password } = ctx.request.body as UserRegister;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim();
    const cleanPassword = password?.trim();
    const cleanLastname = lastname && lastname.trim() !== "" ? lastname.trim() : undefined;

    // Basic validation
    if (!cleanName || !cleanEmail || !cleanPassword) {
        ctx.status = 400;
        ctx.body = { message: "Missing required fields" };
        return;
    }

    // Validate age type
    if (age !== undefined && typeof age !== "number") {
        ctx.status = 400;
        ctx.body = { message: "Age must be a number" };
        return;
    }

    try {
        const newUser = await registerUser({
            name: cleanName,
            lastname: cleanLastname,
            age,
            email: cleanEmail,
            password: cleanPassword,
        });

        ctx.status = 201;
        ctx.body = newUser;

    } catch (err: any) {
        if (err instanceof Error) {
            ctx.status = 400;
            ctx.body = { message: err.message };
            return;
        }

        ctx.status = 500;
        ctx.body = { message: "Internal server error" };
    }
}

export async function getCurrentUserHandler(ctx: Context) {
    const userId = ctx.state.userId;

    if (!userId) {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized" };
        return;
    }

    try {
        const user = await getUserById(userId);

        if (!user) {
            ctx.status = 404;
            ctx.body = { message: "User not found" };
            return;
        }

        ctx.status = 200;
        ctx.body = user;

    } catch (err: any) {
        ctx.status = 500;
        ctx.body = { message: "Internal server error" };
    }
}

export async function updateCurrentUserHandler(ctx: Context) {
    const userId = ctx.state.userId;

    if (!userId) {
        ctx.status = 401;
        ctx.body = { message: "Unauthorized" };
        return;
    }

    const body = ctx.request.body as Partial<UserUpdate>;
    const { name, lastname, age, email } = body;

    const cleanName = name?.trim();
    const cleanEmail = email?.trim();
    const hasLastname = Object.prototype.hasOwnProperty.call(body, "lastname");
    const hasAge = Object.prototype.hasOwnProperty.call(body, "age");

    // Require non-empty name/email if provided
    if (name !== undefined && !cleanName) {
        ctx.status = 400;
        ctx.body = { message: "Name cannot be empty" };
        return;
    }

    if (email !== undefined && !cleanEmail) {
        ctx.status = 400;
        ctx.body = { message: "Email cannot be empty" };
        return;
    }

    if (lastname !== undefined && lastname !== null && typeof lastname !== "string") {
        ctx.status = 400;
        ctx.body = { message: "Lastname must be a string" };
        return;
    }

    // Validate age type
    if (age !== undefined && age !== null && typeof age !== "number") {
        ctx.status = 400;
        ctx.body = { message: "Age must be a number" };
        return;
    }

    const data: UserUpdate = {};
    if (cleanName !== undefined) data.name = cleanName;
    if (hasLastname) {
        if (typeof lastname === "string" && lastname.trim() !== "") {
            data.lastname = lastname.trim();
        } else {
            data.lastname = null;
        }
    }
    if (hasAge) data.age = age === null ? null : age;
    if (cleanEmail !== undefined) data.email = cleanEmail;

    try {
        const updatedUser = await updateUser(userId, data);
        ctx.status = 200;
        ctx.body = updatedUser;
    } catch (err: any) {

        if (err instanceof Error) {
            ctx.status = 400;
            ctx.body = { message: err.message };
            return;
        }

    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
    }
}
