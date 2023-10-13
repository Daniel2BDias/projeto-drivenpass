import { User } from "@prisma/client";
import { faker } from '@faker-js/faker';
import bcrypt from "bcrypt";
import prisma from "@/database";

export const createUser = async (params: Partial<User> = {}): Promise<User> => {
    const givenPassword = params.password || faker.internet.password(10);
    const hash = bcrypt.hashSync(givenPassword, 10);


    return await prisma.user.create({
        data: {
            email: params.email || faker.internet.email(),
            password: hash
        }
    })
};