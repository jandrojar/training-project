import { Context } from "koa";
import { login, logout } from "../services/authService";

export async function loginHandler(ctx: Context) {
	const { email, password } = ctx.request.body as {email:string,password:string};

    if(!email || !password){
        ctx.status=400
        ctx.body={error:'Missing credentials'}
        return
    }

    try {
        const session = await login(email, password);
        ctx.status = 200;
        ctx.body = session;
        return;

    } catch (err: any) {
        // Invalid credentials
        if (err.message === "Invalid credentials") {
            ctx.status = 401;
            ctx.body = { error: "Invalid credentials" };
            return;
        }

        // Unexpected error
        ctx.status = 500;
        ctx.body = { error: "Internal server error" };
    }
}

export async function logoutHandler(ctx: Context) {
    const { sessionId } = ctx.request.body as { sessionId: string }; 

    if (!sessionId) {
        ctx.status = 400;
        ctx.body = { error: 'Missing session id' };
        return;
    }

	try{
		await logout(sessionId)
		ctx.status=200
        ctx.body={success: true}
		return;

	} catch(err:any){
		ctx.status=500
		ctx.body={error:"Internal server error"}
	}
}