import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as questionService from '../services/questionService.js';

const router = express.Router();

// MCQ questions
router.post('/', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['activityId', 'questionText', 'options', 'correctOptionId'])) return;
    if (!validateUUID(res, req.body.activityId)) return;
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
});

router.get('/activity/:activityId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.activityId)) return;
    const questions = await questionService.listQuestionsByActivity(req.params.activityId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const question = await questionService.getQuestionById(req.params.id);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    const question = await questionService.updateQuestion(req.params.id, req.body);
    if (!question) return res.status(404).json({ error: 'Question not found' });
    res.json(question);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const deleted = await questionService.deleteQuestion(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Question not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Student MCQ attempts
router.post('/:questionId/attempts', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.questionId)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['attemptNumber', 'selectedOptionId', 'isCorrect'])) return;
    const { studentId } = req.student;
    const attempt = await questionService.recordAttempt({
      studentId,
      questionId: req.params.questionId,
      attemptNumber: req.body.attemptNumber,
      selectedOptionId: req.body.selectedOptionId,
      isCorrect: req.body.isCorrect,
    });
    res.status(201).json(attempt);
  } catch (err) {
    next(err);
  }
});

router.get('/:questionId/attempts', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.questionId)) return;
    const { studentId } = req.student;
    const attempts = await questionService.listAttemptsByQuestion(studentId, req.params.questionId);
    res.json(attempts);
  } catch (err) {
    next(err);
  }
});

export default router;