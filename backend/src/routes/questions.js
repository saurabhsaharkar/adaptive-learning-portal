import express from "express";

import {
  getQuestionsByActivity,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../services/questions.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/questions/activity/:activityId
router.get(
  "/activity/:activityId",
  asyncHandler(async (req, res) => {
    const questions = await getQuestionsByActivity(req.params.activityId);

    res.status(200).json({ questions });
  }),
);

// GET /api/questions/:questionId
router.get(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const question = await getQuestionById(req.params.questionId);
    res.status(200).json({ question });
  }),
);

// POST /api/questions
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const question = await createQuestion(req.body);
    res.status(201).json({ question });
  }),
);

// PATCH /api/questions/:questionId
router.patch(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const question = await updateQuestion(req.params.questionId, req.body);

    res.status(200).json({ question });
  }),
);

// DELETE /api/questions/:questionId
router.delete(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const result = await deleteQuestion(req.params.questionId);
    res.status(200).json(result);
  }),
);

export default router;
