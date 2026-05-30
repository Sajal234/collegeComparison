import { prisma } from "../config/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const predictColleges = asyncHandler(async (req, res) => {
    const { exam, rank, category, limit } = req.validated.query;

    const cutoffs = await prisma.admissionCutoff.findMany({
        where: {
            exam: {
                equals: exam,
                mode: "insensitive",
            },
            category: {
                equals: category,
                mode: "insensitive",
            },
            closingRank: {
                gte: rank,
            },
        },
        orderBy: {
            closingRank: "asc",
        },
        take: limit,
        include: {
            college: {
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
            },
        },
    });

    const recommendations = cutoffs.map((cutoff) => ({
        college: cutoff.college,
        matchedCourse: cutoff.courseName,
        exam: cutoff.exam,
        category: cutoff.category,
        openingRank: cutoff.openingRank,
        closingRank: cutoff.closingRank,
        year: cutoff.year,
        round: cutoff.round,
        rankBuffer: cutoff.closingRank - rank,
    }));

    return res.status(200).json(
        new ApiResponse({
            input: {
                exam,
                rank,
                category,
            },
            totalMatches: recommendations.length,
            recommendations,
        }, "College predictions fetched successfully")
    );
});

export { predictColleges };
