import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getColleges = asyncHandler(async (req, res) => {
    const {
        page,
        limit,
        search,
        city,
        state,
        ownership,
        minFees,
        maxFees,
        sortBy,
        sortOrder,
    } = req.query;

    if (minFees !== undefined && maxFees !== undefined && minFees > maxFees) {
        throw new ApiError(400, "Minimum fees cannot be greater than maximum fees");
    }

    const filters = [];

    if (search) {
        filters.push({
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { city: { contains: search, mode: "insensitive" } },
                { state: { contains: search, mode: "insensitive" } },
            ],
        });
    }

    if (city) {
        filters.push({ city: { equals: city, mode: "insensitive" } });
    }

    if (state) {
        filters.push({ state: { equals: state, mode: "insensitive" } });
    }

    if (ownership) {
        filters.push({ ownership: { equals: ownership, mode: "insensitive" } });
    }

    if (minFees !== undefined || maxFees !== undefined) {
        filters.push({
            averageFees: {
                ...(minFees !== undefined && { gte: minFees }),
                ...(maxFees !== undefined && { lte: maxFees }),
            },
        });
    }

    const where = filters.length > 0 ? { AND: filters } : {};
    const skip = (page - 1) * limit;

    const [colleges, totalColleges] = await Promise.all([
        prisma.college.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                state: true,
                ownership: true,
                ranking: true,
                rating: true,
                averageFees: true,
                placements: {
                    select: {
                        averagePackage: true,
                        highestPackage: true,
                        placementRate: true,
                    },
                },
            },
        }),
        prisma.college.count({ where }),
    ]);

    return res.status(200).json(
        new ApiResponse({
            colleges,
            pagination: {
                page,
                limit,
                totalColleges,
                totalPages: Math.ceil(totalColleges / limit),
            },
        }, "Colleges fetched successfully")
    );
});

const getCollegeById = asyncHandler(async (req, res) => {
    const { collegeId } = req.params;

    const college = await prisma.college.findUnique({
        where: {
            id: collegeId,
        },
        include: {
            courses: {
                orderBy: {
                    fees: "asc",
                },
            },
            placements: true,
            reviews: {
                take: 5,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    return res.status(200).json(
        new ApiResponse(college, "College details fetched successfully")
    );
});

const compareColleges = asyncHandler(async (req, res) => {
    const { collegeIds } = req.query;

    const colleges = await prisma.college.findMany({
        where: {
            id: {
                in: collegeIds,
            },
        },
        include: {
            courses: {
                orderBy: {
                    fees: "asc",
                },
            },
            placements: true,
        },
    });

    if (colleges.length !== collegeIds.length) {
        throw new ApiError(404, "One or more colleges were not found");
    }

    const collegesById = new Map(colleges.map((college) => [college.id, college]));
    const orderedColleges = collegeIds.map((collegeId) => collegesById.get(collegeId));

    return res.status(200).json(
        new ApiResponse({
            colleges: orderedColleges,
            comparedFields: [
                "ranking",
                "rating",
                "averageFees",
                "courses",
                "placements",
            ],
        }, "Colleges compared successfully")
    );
});

export {
    getColleges,
    getCollegeById,
    compareColleges,
};
