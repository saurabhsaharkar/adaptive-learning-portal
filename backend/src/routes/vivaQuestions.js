import express from "express";

import {
  getVivaQuestionsByModule,
  getVivaQuestionById,
  createVivaQuestion,
  updateVivaQuestion,
  deleteVivaQuestion,
} from "../services/vivaQuestions.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/viva-questions/module/:moduleId
router.get(
  "/module/:moduleId",
  asyncHandler(async (req, res) => {
    const questions = await getVivaQuestionsByModule(req.params.moduleId);

    res.status(200).json({ questions });
  }),
);

// GET /api/viva-questions/:questionId
router.get(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const question = await getVivaQuestionById(req.params.questionId);

    res.status(200).json({ question });
  }),
);

// POST /api/viva-questions
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const question = await createVivaQuestion(req.body);
    res.status(201).json({ question });
  }),
);

// PATCH /api/viva-questions/:questionId
router.patch(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const question = await updateVivaQuestion(req.params.questionId, req.body);

    res.status(200).json({ question });
  }),
);

// DELETE /api/viva-questions/:questionId
router.delete(
  "/:questionId",
  asyncHandler(async (req, res) => {
    const result = await deleteVivaQuestion(req.params.questionId);

    res.status(200).json(result);
  }),
);

export default router;
