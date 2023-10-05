import { ApplicationError } from "../middlewares/error-handler";

export function conflictError(message?: string): ApplicationError {
  const errorMsg = message || "Conflict";
  return {
    name: "ConflictError",
    message: errorMsg
  }
}