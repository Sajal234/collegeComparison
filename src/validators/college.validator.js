import { z } from "zod";

const collegeListQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().optional(),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    ownership: z.string().trim().optional(),
    minFees: z.coerce.number().int().min(0).optional(),
    maxFees: z.coerce.number().int().min(0).optional(),
    sortBy: z.enum(["ranking", "rating", "averageFees", "name"]).default("ranking"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

const collegeIdParamSchema = z.object({
    collegeId: z.string().uuid("Invalid college id"),
});

const compareCollegesQuerySchema = z.object({
    ids: z.string().min(1, "College ids are required"),
}).transform((query) => {
    const collegeIds = query.ids
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

    return {
        collegeIds,
    };
}).refine((query) => query.collegeIds.length >= 2, {
    message: "Select at least 2 colleges to compare",
    path: ["ids"],
}).refine((query) => query.collegeIds.length <= 3, {
    message: "You can compare up to 3 colleges at a time",
    path: ["ids"],
}).refine((query) => query.collegeIds.every((id) => z.string().uuid().safeParse(id).success), {
    message: "All college ids must be valid",
    path: ["ids"],
});

export {
    collegeListQuerySchema,
    collegeIdParamSchema,
    compareCollegesQuerySchema,
};
