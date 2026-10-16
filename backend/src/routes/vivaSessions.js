import express from "express";

import {
  getVivaSessionsByUser,
  getVivaSessionById,
  createVivaSession,
  appendVivaMessage,
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

    const session = await createVivaSession(user_id, module_id);

    res.status(201).json({ session });
  }),
);

// GET /api/viva-sessions/:sessionId
router.get(
  "/:sessionId",
  asyncHandler(async (req, res) => {
    const session = await getVivaSessionById(req.params.sessionId);

    res.status(200).json({ session });
  }),
);

// POST /api/viva-sessions/:sessionId/messages
router.post(
  "/:sessionId/messages",
  asyncHandler(async (req, res) => {
    const session = await appendVivaMessage(
      req.params.sessionId,
      req.body.message,
    );

    res.status(200).json({ session });
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
