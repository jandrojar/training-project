import prisma from "../lib/prisma";

export default class SessionPrismaRepository {
  async createSession(userId: string, expiresAt: Date) {
    return prisma.session.create({ data: { userId, expiresAt } });
  }

  async findSessionById(id: string) {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  async deleteSession(id: string) {
    return prisma.session.delete({
      where: { id },
    });
  }

  async updateSessionExpiry(id: string, newExpiresAt: Date) {
    return prisma.session.update({
      where: { id },
      data: { expiresAt: newExpiresAt },
    });
  }
}
