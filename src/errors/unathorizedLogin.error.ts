import { ApplicationError } from "@/utils/protocols";

export function unauthorizedLoginError(): ApplicationError {
  return {
    name: 'UnauthorizedLoginError',
    message: `Please, check your credentials!`,
  };
}