import UserRepository from "../repositories/UserRepository";
import SessionRepository from "../repositories/SessionRepository";
import bcrypt from "bcrypt";

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();

export async function login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if(!user){
        throw new Error('Invalid credentials');
    }

    // Compare input password with hashed password in database
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error("Invalid credentials");
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    const session = await sessionRepo.createSession(user.id, expiresAt);

    return {
        sessionId: session.id,
        expiresAt,
        userId: user.id
    };
}

export async function logout(sessionId: string) {
    await sessionRepo.deleteSession(sessionId);
    return {success:true}
}