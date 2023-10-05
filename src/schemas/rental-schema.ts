import joi from "joi";
import { RENTAL_LIMITATIONS } from "../services/rentals-service";
import { RentalFinishInput, RentalInput } from "../protocols";

const { MIN, MAX } = RENTAL_LIMITATIONS;

export const rentalSchema = joi.object<RentalInput>({
  userId: joi.number().required(),
  moviesId:
    joi.array().min(MIN).max(MAX).required()
});

export const rentalFinishSchema = joi.object<RentalFinishInput>({
  rentalId: joi.number().required()
})
