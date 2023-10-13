import { Router } from "express";
import { validateBody } from "../middlewares/validation.middleware";
import { authenticateToken } from "../middlewares/validateToken.middleware";
import { credentialsControllers } from "@/controllers/credentials.controller";
import credentialSchema from "@/schemas/credentials.schema";

const credentialsRouter = Router();

credentialsRouter.all("/*", authenticateToken)
                 .post("/post", validateBody(credentialSchema), credentialsControllers.postCredential)
                 .get("/getall/", credentialsControllers.getUserCredentials)
                 .get("/get/:credentialId", credentialsControllers.getOneCredential)
                 .delete("/delete/:credentialId", credentialsControllers.deleteCredential);

export { credentialsRouter };