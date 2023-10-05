import { ApplicationError } from "../middlewares/error-handler";

export function insufficientAgeError(message?: string): ApplicationError {
  const errorMsg = message || "Insufficient Age";
  return {
    name: "InsufficientAgeError",
    message: errorMsg
  }
}