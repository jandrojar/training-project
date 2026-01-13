import { Context } from "koa";
import { registerUser } from "../services/userService";
import type { UserRegister } from "../types/User";

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
