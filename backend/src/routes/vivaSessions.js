import express from "express";

import {
  getVivaSessionsByUser,
  getVivaSessionById,
  getCurrentVivaQuestion,
  createVivaSession,
  submitVivaAnswer,
  advanceVivaQuestion,
  abandonVivaSession,
} from "../services/vivaSessions.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/viva-sessions/user/:userId
router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const sessions = await getVivaSessionsByUser(req.params.userId);

    res.status(200).json({ sessions });
  }),
);

// POST /api/viva-sessions
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { user_id, module_id } = req.body;

    const result = await createVivaSession(user_id, module_id);

    res.status(201).json(result);
  }),
);

// GET /api/viva-sessions/:sessionId
router.get(
  "/:sessionId",
  asyncHandler(async (req, res) => {
    const session = await getVivaSessionById(req.params.sessionId);

    const currentQuestion = await getCurrentVivaQuestion(
      session.module_id,
      session.current_question_position,
    );

    res.status(200).json({
      session,
      current_question: currentQuestion,
    });
  }),
);

// POST /api/viva-sessions/:sessionId/answers
router.post(
  "/:sessionId/answers",
  asyncHandler(async (req, res) => {
    const { answer } = req.body;

    const result = await submitVivaAnswer(req.params.sessionId, answer);

    res.status(200).json(result);
  }),
);

// POST /api/viva-sessions/:sessionId/advance
// Call only after the backend's AI evaluator accepts the answer.
router.post(
  "/:sessionId/advance",
  asyncHandler(async (req, res) => {
    const session = await advanceVivaQuestion(req.params.sessionId);

    res.status(200).json({ session });
  }),
);

// POST /api/viva-sessions/:sessionId/abandon
router.post(
  "/:sessionId/abandon",
  asyncHandler(async (req, res) => {
    const session = await abandonVivaSession(req.params.sessionId);

    res.status(200).json({ session });
  }),
);

export default router;
