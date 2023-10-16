import { userServices } from "@/services/user.services";
import { Request, Response } from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { unauthorizedError } from "@/errors/unathorized.error";

dotenv.config()

const signUp = async (req: Request, res: Response) => {
    const { body } = req;
    const userServiceAcess = await userServices.signUp(body);
    res.sendStatus(httpStatus.CREATED);
};

const login = async (req: Request, res: Response) => {
    const { body } = req;
    const secretKey = process.env.JWT_SECRET;

    const userServiceAcess = await userServices.login(body);
    delete userServiceAcess.password
    const jwtGenerator = 
    jwt.sign(userServiceAcess, secretKey, (err, token) => {
        if (err) {
          return res.status(500).json({ message: "JWT generation failed" });
        }
  
        res.status(httpStatus.OK).send({ token });
      });
};

export const userControllers = {login, signUp}