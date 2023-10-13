import { AuthenticatedRequest } from "@/middlewares/validateToken.middleware";
import { credentialServices } from "@/services/credentials.services";
import { Response } from "express";
import httpStatus from "http-status";

const postCredential = async (req: AuthenticatedRequest, res: Response) => {
   const { id, body } = req;
   const credentialServicesAcess = await credentialServices.post(id, body);
   res.sendStatus(httpStatus.CREATED);
};

const getUserCredentials = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req;
    const credentialServicesAcess = await credentialServices.getUserCredentials(id);
    res.status(httpStatus.OK).send(credentialServicesAcess);
};

const getOneCredential = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req;
    const { credentialId } = req.params;
    const credentialServicesAcess = await credentialServices.getOneCredential(id, Number(credentialId))
    res.status(httpStatus.OK).send(credentialServicesAcess);
};



const deleteCredential = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req;
    const { credentialId } = req.params;
    const deleteThatCredential = await credentialServices.deleteCredential(id, Number(credentialId));
    res.sendStatus(httpStatus.NO_CONTENT);
};

export const credentialsControllers = {postCredential, getOneCredential, getUserCredentials, deleteCredential}