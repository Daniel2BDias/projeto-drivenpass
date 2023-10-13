import { conflictDataError } from "@/errors/conflictData.error";
import { getCredentialError } from "@/errors/getCredential.error";
import { credentialRepository } from "@/repositories/credentials.repository";
import { Prisma } from "@prisma/client";
import criptr from "cryptr";
import dotenv from "dotenv";

dotenv.config();
const encrypter = new criptr(process.env.CRYPTR);

const post = async (id: number, body: Prisma.CredentialUncheckedCreateInput) => {
    const checkForDuplicates = await credentialRepository.checkTitle(id, body);
    if (checkForDuplicates) throw conflictDataError();
    body.password = encrypter.encrypt(body.password)
    const registerCredential = await credentialRepository.post(id, body);
    return registerCredential;
};

const getUserCredentials = async (id: number) => {
    const fetchData = await credentialRepository.getUserCredentials(id)
    fetchData.forEach((el) => el.password = encrypter.decrypt(el.password));
    return fetchData;
};

const getOneCredential = async (id: number, credentialId: number) => {
    const getThatCredential = await credentialRepository.getOneCredential(id, credentialId);
    if(!getThatCredential) throw getCredentialError();
    getThatCredential.password = encrypter.decrypt(getThatCredential.password);
    return getThatCredential;
};

const deleteCredential = async (id: number, credentialId: number) => {
    const checkOwnership = await credentialRepository.getOneCredential(id, credentialId);
    if(!checkOwnership) throw getCredentialError();

    const deleteThatCredential = await credentialRepository.deleteCredential(id, credentialId);
    return deleteThatCredential;
};

export const credentialServices = {post, getUserCredentials, getOneCredential, deleteCredential};