import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import coursesRouter from "./routes/courses.js";
import modulesRouter from "./routes/modules.js";
import submodulesRouter from "./routes/submodules.js";
import questionsRouter from "./routes/questions.js";
import vivaQuestionsRouter from "./routes/vivaQuestions.js";
import vivaSessionsRouter from "./routes/vivaSessions.js";
import activitiesRouter from "./routes/activities.js";
import activityBlocksRouter from "./routes/activityBlocks.js";
import modulePrerequisitesRouter from "./routes/modulePrerequisites.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRouter);
app.use("/api/modules", modulesRouter);
app.use("/api/submodules", submodulesRouter);
app.use("/api/questions", questionsRouter);
app.use("/api/viva-questions", vivaQuestionsRouter);
app.use("/api/viva-sessions", vivaSessionsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/activity-blocks", activityBlocksRouter);
app.use("/api/module-prerequisites", modulePrerequisitesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
