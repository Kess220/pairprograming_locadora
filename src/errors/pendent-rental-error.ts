import { ApplicationError } from "../middlewares/error-handler";

export function pendentRentalError(message?: string): ApplicationError {
  const errorMsg = message || "Movie rental is pending";
  return {
    name: "PendentRentalError",
    message: errorMsg
  }
}