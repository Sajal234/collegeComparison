import { z } from "zod";

const predictorQuerySchema = z.object({
    exam: z.string().trim().min(1, "Exam is required"),
    rank: z.coerce.number().int().min(1, "Rank must be greater than 0"),
    category: z.string().trim().default("General"),
    limit: z.coerce.number().int().min(1).max(20).default(10),
});

export { predictorQuerySchema };
