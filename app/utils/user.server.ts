import bcrypt from "bcryptjs";
import type { RegistrationForm } from "./types.server";
import { prisma } from "./prisma.server";

export const createUser = async (user: RegistrationForm) => {
  const passwordhash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordhash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });

  return { id: newUser.id, email: user.email };
};

export const getUserById = async (userId: string | undefined) => {
  return await prisma.user.findUnique({ where: { id: userId } });
};
