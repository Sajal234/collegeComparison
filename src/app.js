import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware.js";
import collegeRouter from "./routes/college.routes.js";
import predictorRouter from "./routes/predictor.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

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
