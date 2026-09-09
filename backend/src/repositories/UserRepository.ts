import prisma from "../lib/prisma";
import type { UserCreateInput, UserUpdateInput, UserPasswordUpdateInput } from "../types/User";

export default class UserPrismaRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: UserCreateInput) {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async updatePassword(id: string, data: UserPasswordUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
