import { ApplicationError } from "../utils/protocols";

export function getCredentialError(): ApplicationError {
    return {
      name: 'getCredentialError',
      message: 'Essa credencial não existe ou não ela não pertence a você.',
    };
  }