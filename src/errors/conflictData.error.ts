import { ApplicationError } from "../utils/protocols";

export function conflictDataError(): ApplicationError {
    return {
      name: 'conflictDataError',
      message: 'Title already used!',
    };
  }