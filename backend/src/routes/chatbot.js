import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as chatbotService from '../services/chatbotService.js';

const router = express.Router();

// Predetermined chatbot questions
router.post('/questions', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['moduleId', 'questionText'])) return;
    if (!validateUUID(res, req.body.moduleId)) return;
    const question = await chatbotService.createChatbotQuestion(req.body);
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
});

router.get('/questions/module/:moduleId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    const questions = await chatbotService.listChatbotQuestions(req.params.moduleId);
    res.json(questions);
  } catch (err) {
    next(err);
  }
});

// Sessions
router.post('/sessions', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['moduleId'])) return;
    if (!validateUUID(res, req.body.moduleId)) return;
    const { studentId } = req.student;
    const session = await chatbotService.createSession({ studentId, moduleId: req.body.moduleId });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

router.get('/sessions/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const session = await chatbotService.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.put('/sessions/:id/status', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['status'])) return;
    if (!['in_progress', 'passed', 'failed'].includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const session = await chatbotService.updateSessionStatus(req.params.id, req.body.status);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

router.put('/sessions/:id/advance', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const session = await chatbotService.advanceSessionQuestion(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// Get the next question to answer in a chatbot session
router.get('/sessions/:id/next-question', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const result = await chatbotService.getNextQuestion(req.params.id);
    if (!result) return res.status(404).json({ error: 'Session not found' });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Messages
router.post('/sessions/:sessionId/messages', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.sessionId)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['sender', 'message'])) return;
    if (!['student', 'assistant'].includes(req.body.sender)) {
      return res.status(400).json({ error: "sender must be 'student' or 'assistant'" });
    }
    const message = await chatbotService.addMessage({
      sessionId: req.params.sessionId,
      questionId: req.body.questionId || null,
      sender: req.body.sender,
      message: req.body.message,
      evaluation: req.body.evaluation || null,
    });
    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
});

router.get('/sessions/:sessionId/messages', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.sessionId)) return;
    const messages = await chatbotService.listMessages(req.params.sessionId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// Question results
router.post('/sessions/:sessionId/results', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.sessionId)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['questionId', 'status'])) return;
    if (!validateUUID(res, req.body.questionId)) return;
    if (!['pending', 'satisfactory', 'needs_improvement'].includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const result = await chatbotService.upsertQuestionResult({
      sessionId: req.params.sessionId,
      questionId: req.body.questionId,
      status: req.body.status,
      evaluation: req.body.evaluation || null,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/sessions/:sessionId/results', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.sessionId)) return;
    const results = await chatbotService.listQuestionResults(req.params.sessionId);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

export default router;