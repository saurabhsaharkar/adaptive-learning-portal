import express from 'express';
import coursesRouter from './courses.js';
import modulesRouter from './modules.js';
import submodulesRouter from './submodules.js';
import activitiesRouter from './activities.js';
import progressRouter from './progress.js';
import questionsRouter from './questions.js';
import chatbotRouter from './chatbot.js';
import studentsRouter from './students.js';
import authRouter from './auth.js';

const router = express.Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Auth routes (signup/login/me/logout)
router.use('/auth', authRouter);

// Mount all feature routes
router.use('/courses', coursesRouter);
router.use('/modules', modulesRouter);
router.use('/submodules', submodulesRouter);
router.use('/activities', activitiesRouter);
router.use('/progress', progressRouter);
router.use('/questions', questionsRouter);
router.use('/chatbot', chatbotRouter);
router.use('/students', studentsRouter);

export default router;