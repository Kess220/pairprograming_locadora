import { ApplicationError } from "../middlewares/error-handler";

export function movieAlreadyInRental(message?: string): ApplicationError {
  const errorMsg = message || "Movie Already Rented";
  return {
    name: "MovieInRentalError",
    message: errorMsg
  }
}