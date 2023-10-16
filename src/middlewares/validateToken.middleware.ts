import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { unauthorizedError } from '../errors/unathorized.error';
import { authenticationRepository } from '@/repositories/authentication.repository';

dotenv.config();

export async function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) throw unauthorizedError();

  const token = authHeader.split(' ')[1];
  if (!token) throw unauthorizedError();

  if(process.env.JWT_SECRET === undefined || process.env.JWT_SECRET === null) throw unauthorizedError();

  const { email, id } = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;

  const user = await authenticationRepository.findUser(email);
  if (!user) throw unauthorizedError();

  req.id = id;
  next();
}

export type AuthenticatedRequest = Request & JWTPayload;

type JWTPayload = {
  email: string;
  id: number;
};