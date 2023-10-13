import prisma from "@/database";
import { Prisma, User } from "@prisma/client";

const login = async (data: Omit<User, "id">) => {
    return await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
};

const signUp = async (data: Prisma.UserUncheckedCreateInput) => {
    return await prisma.user.create({
        data,
    })
};

const checkForUser = async (data: Prisma.UserUncheckedCreateInput) => {
    return await prisma.user.findUnique({
        where: {
            email: data.email
        }
    });
};

export const userRepository = {login, signUp, checkForUser};