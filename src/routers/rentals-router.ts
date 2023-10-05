import { Router } from "express";

import { createRental, getRentals, getRentalById, finishRental } from "../controllers/rentals-controller";
import { validateSchemaMiddleware } from "../middlewares/schema-validator";
import { rentalFinishSchema, rentalSchema } from "../schemas/rental-schema";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.get("/rentals/:id", getRentalById);
rentalsRouter.post("/rentals", validateSchemaMiddleware(rentalSchema), createRental);
rentalsRouter.post("/rentals/finish", validateSchemaMiddleware(rentalFinishSchema), finishRental);

export default rentalsRouter;