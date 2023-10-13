import prisma from "@/database";

const findUser = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }
    });
};

export const authenticationRepository = { findUser };