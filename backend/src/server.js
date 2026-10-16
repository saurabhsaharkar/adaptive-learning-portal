import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());

// API routes
app.use("/api", apiRouter);

// 404
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
