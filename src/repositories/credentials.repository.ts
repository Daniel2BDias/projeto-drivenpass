import prisma from "@/database";
import { Prisma } from "@prisma/client";

const post = async (id: number, body: Prisma.CredentialUncheckedCreateInput) => {
    body.userId = id;
    return await prisma.credential.create({
        data: body
    })
};

const checkTitle = async (id: number, body: Prisma.CredentialUncheckedCreateInput) => {
    return await prisma.credential.findFirst({
        where: {
            title: body.title
        }
    })
};

const getUserCredentials = async (id: number) => {
    return await prisma.credential.findMany({
        where: {
            userId: id
        }
    })
};

const getOneCredential = async (id: number, credentialId: number) => {
    return await prisma.credential.findFirst({
        where:{
            userId: id,
            id: credentialId
        },
    })
};

const deleteCredential = async (id: number, credentialId: number) => {
    return await prisma.credential.delete({
        where: {
            id: credentialId,
        },
    })
};


export const credentialRepository = {post, checkTitle, getUserCredentials, getOneCredential, deleteCredential};