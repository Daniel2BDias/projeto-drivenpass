import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ApplicationError, RequestError } from '../utils/protocols';

export function handleApplicationErrors(
  err: RequestError | ApplicationError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
 

  if (err.hasOwnProperty('status') && err.name === 'RequestError') {
    return res.status((err as RequestError).status).send({
      message: err.message,
    });
  }

  if(err.name === "UnauthorizedLoginError") return res.status(httpStatus.UNAUTHORIZED).send(err.message);

  if(err.name === "UnauthorizedError") return res.status(httpStatus.UNAUTHORIZED).send(err.message);

  if(err.name === 'JsonWebTokenError') return res.status(httpStatus.UNAUTHORIZED).send(err.message);

  if(err.name === 'conflictError') return res.status(httpStatus.CONFLICT).send(err.message);

  if(err.name === "conflictDataError") return res.status(httpStatus.CONFLICT).send(err.message);

  if(err.name === "InvalidDataError") return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(err.message);
  
  if(err.name === 'getCredentialError') return res.status(httpStatus.FORBIDDEN).send(err.message);

  console.error(err);
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'InternalServerError',
    message: 'Internal Server Error',
  });
}