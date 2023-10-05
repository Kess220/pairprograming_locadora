import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import rentalsService from "../services/rentals-service";
import { isValid } from "../utils/id-validator";
import { RentalFinishInput, RentalInput } from "../protocols";

export async function getRentals(req: Request, res: Response) {
  const rentals = await rentalsService.getRentals();
  res.send(rentals);
}

export async function getRentalById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  if (!isValid(id)) return res.sendStatus(httpStatus.BAD_REQUEST);

  try {
    const rental = await rentalsService.getRentalById(id);
    res.send(rental);
  } catch (error) {
    console.log(error);
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createRental(req: Request, res: Response, next: NextFunction) {
  const rentalInput = req.body as RentalInput;
  try {
    await rentalsService.createRental(rentalInput);
    res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    if (error.name === "InsufficientAgeError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "MovieInRentalError") {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }
    if (error.name === "PendentRentalError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }

    next(error);
  }
}

export async function finishRental(req: Request, res: Response, next: NextFunction) {
  const { rentalId } = req.body as RentalFinishInput;
  try {
    await rentalsService.finishRental(rentalId);
    res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}