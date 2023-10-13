import { conflictError } from "@/errors/conflict.error";
import { unauthorizedLoginError } from "@/errors/unathorizedLogin.error";
import { userRepository } from "@/repositories/user.repository";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcrypt";

const login = async (body: Omit<User, "id">) => {
    const userRepositoryAcess: User = await userRepository.login(body);
    if(!userRepositoryAcess) throw unauthorizedLoginError();

    const passwordAuth = bcrypt.compareSync(body.password, userRepositoryAcess.password);
    if(!passwordAuth) throw unauthorizedLoginError();
    return userRepositoryAcess;
};

const signUp = async (body: Prisma.UserUncheckedCreateInput) => {
    const checkForUser = await userRepository.checkForUser(body);
    if(checkForUser) throw conflictError();

    const hashPass = bcrypt.hashSync(body.password, 10);
    const userRepositoryAcess = await userRepository.signUp({email: body.email, password: hashPass});
    return userRepositoryAcess;
};

export const userServices = {login, signUp};