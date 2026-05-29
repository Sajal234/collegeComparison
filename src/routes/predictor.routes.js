import { Router } from "express";
import { predictColleges } from "../controllers/predictor.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { predictorQuerySchema } from "../validators/predictor.validator.js";

const router = Router();

router
    .route("/")
    .get(validate(predictorQuerySchema, "query"), predictColleges);

export default router;
