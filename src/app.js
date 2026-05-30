import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import collegeRouter from "./routes/college.routes.js";
import predictorRouter from "./routes/predictor.routes.js";

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
            .split(",")
            .map((allowedOrigin) => allowedOrigin.trim())
            .filter(Boolean);

        if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "College comparison backend API",
        endpoints: {
            health: "/health",
            colleges: "/api/v1/colleges",
            predictor: "/api/v1/predictor?exam=JEE Advanced&rank=400",
        },
    });
});

app.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        status: "ok",
        message: "College comparison API is running",
    });
});

app.use("/api/v1/colleges", collegeRouter);
app.use("/api/v1/predictor", predictorRouter);

app.use(errorHandler);

export default app;
