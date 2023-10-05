import express, { json, Request, Response } from "express";
import "express-async-errors";
import dotenv from "dotenv";

import rentalsRouter from "./routers/rentals-router";
import { handleApplicationErrors } from "./middlewares/error-handler";

dotenv.config();

const app = express();
app.use(json());

app.get("/health", (req: Request, res: Response) => res.send("ok!"));
app.use(rentalsRouter);
app.use(handleApplicationErrors);

export default app;