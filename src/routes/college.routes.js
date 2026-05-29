import { Router } from "express";
import {
    compareColleges,
    getCollegeById,
    getColleges,
} from "../controllers/college.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
    collegeIdParamSchema,
    collegeListQuerySchema,
    compareCollegesQuerySchema,
} from "../validators/college.validator.js";

const router = Router();

router
    .route("/")
    .get(validate(collegeListQuerySchema, "query"), getColleges);

router
    .route("/compare")
    .get(validate(compareCollegesQuerySchema, "query"), compareColleges);

router
    .route("/:collegeId")
    .get(validate(collegeIdParamSchema, "params"), getCollegeById);

export default router;
