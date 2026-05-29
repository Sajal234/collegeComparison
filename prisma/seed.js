import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const colleges = [
    {
        name: "Indian Institute of Technology Bombay",
        slug: "iit-bombay",
        city: "Mumbai",
        state: "Maharashtra",
        ownership: "Government",
        ranking: 1,
        rating: 4.8,
        averageFees: 230000,
        description: "A premier engineering institute known for strong academics, placements, and research.",
        courses: [
            { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", fees: 230000, seats: 120 },
            { name: "Electrical Engineering", degree: "B.Tech", duration: "4 years", fees: 230000, seats: 110 },
        ],
        placement: {
            averagePackage: 23.5,
            highestPackage: 168,
            placementRate: 92,
            topRecruiters: ["Google", "Microsoft", "Goldman Sachs", "Tata Steel"],
        },
    },
    {
        name: "Indian Institute of Technology Delhi",
        slug: "iit-delhi",
        city: "New Delhi",
        state: "Delhi",
        ownership: "Government",
        ranking: 2,
        rating: 4.7,
        averageFees: 225000,
        description: "A top technical institute with strong industry links and high research output.",
        courses: [
            { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", fees: 225000, seats: 115 },
            { name: "Mechanical Engineering", degree: "B.Tech", duration: "4 years", fees: 225000, seats: 100 },
        ],
        placement: {
            averagePackage: 22.1,
            highestPackage: 125,
            placementRate: 90,
            topRecruiters: ["Amazon", "Microsoft", "Uber", "Qualcomm"],
        },
    },
    {
        name: "Birla Institute of Technology and Science Pilani",
        slug: "bits-pilani",
        city: "Pilani",
        state: "Rajasthan",
        ownership: "Private",
        ranking: 7,
        rating: 4.5,
        averageFees: 520000,
        description: "A well-known private institute with flexible academics and strong alumni network.",
        courses: [
            { name: "Computer Science", degree: "B.E.", duration: "4 years", fees: 520000, seats: 150 },
            { name: "Electronics and Instrumentation", degree: "B.E.", duration: "4 years", fees: 520000, seats: 120 },
        ],
        placement: {
            averagePackage: 18.4,
            highestPackage: 60.7,
            placementRate: 88,
            topRecruiters: ["Adobe", "Oracle", "Flipkart", "Cisco"],
        },
    },
    {
        name: "Vellore Institute of Technology",
        slug: "vit-vellore",
        city: "Vellore",
        state: "Tamil Nadu",
        ownership: "Private",
        ranking: 11,
        rating: 4.2,
        averageFees: 198000,
        description: "A large private university with broad engineering programs and national student intake.",
        courses: [
            { name: "Computer Science and Engineering", degree: "B.Tech", duration: "4 years", fees: 198000, seats: 720 },
            { name: "Information Technology", degree: "B.Tech", duration: "4 years", fees: 195000, seats: 360 },
        ],
        placement: {
            averagePackage: 9.9,
            highestPackage: 88,
            placementRate: 82,
            topRecruiters: ["TCS", "Infosys", "Microsoft", "Deloitte"],
        },
    },
];

async function main() {
    const demoUser = await prisma.user.upsert({
        where: {
            email: "demo@student.com",
        },
        update: {},
        create: {
            name: "Demo Student",
            email: "demo@student.com",
            password: "demo-password",
        },
    });

    for (const college of colleges) {
        const createdCollege = await prisma.college.upsert({
            where: {
                slug: college.slug,
            },
            update: {},
            create: {
                name: college.name,
                slug: college.slug,
                city: college.city,
                state: college.state,
                ownership: college.ownership,
                ranking: college.ranking,
                rating: college.rating,
                averageFees: college.averageFees,
                description: college.description,
                courses: {
                    create: college.courses,
                },
                placements: {
                    create: college.placement,
                },
            },
        });

        await prisma.review.upsert({
            where: {
                id: `${createdCollege.slug}-demo-review`,
            },
            update: {},
            create: {
                id: `${createdCollege.slug}-demo-review`,
                collegeId: createdCollege.id,
                userId: demoUser.id,
                rating: Math.round(college.rating),
                title: `${college.name} review`,
                comment: "Good academics, useful peer group, and strong placement support.",
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        console.log("Database seeded successfully");
    })
    .catch(async (err) => {
        console.error("Failed to seed database", err);
        await prisma.$disconnect();
        process.exit(1);
    });
