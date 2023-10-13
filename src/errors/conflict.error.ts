import { ApplicationError } from "../utils/protocols";

export function conflictError(): ApplicationError {
    return {
      name: 'conflictError',
      message: 'Email Already Registered',
    };
  }