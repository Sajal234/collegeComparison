import { ApiError } from "../utils/ApiError.js";

const validate = (schema, source = "body") => {
    return (req, _res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const errors = result.error.errors.map((error) => ({
                field: error.path.join("."),
                message: error.message,
            }));

            throw new ApiError(400, "Validation failed", errors);
        }

        req[source] = result.data;
        next();
    };
};

export { validate };
