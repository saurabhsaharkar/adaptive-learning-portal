import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as progressService from '../services/progressService.js';

const router = express.Router();

// Activity progress
router.post('/activity', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['activityId', 'status'])) return;
    const { studentId } = req.student;
    const progress = await progressService.upsertActivityProgress({
      studentId,
      activityId: req.body.activityId,
      status: req.body.status,
    });
    res.status(201).json(progress);
  } catch (err) {
    next(err);
  }
});

router.get('/activity/:activityId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.activityId)) return;
    const { studentId } = req.student;
    const progress = await progressService.getActivityProgress(studentId, req.params.activityId);
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (err) {
    next(err);
  }
});

router.get('/activity', authenticate, async (req, res, next) => {
  try {
    const { studentId } = req.student;
    const progress = await progressService.listActivityProgressByStudent(studentId);
    res.json(progress);
  } catch (err) {
    next(err);
  }
});

// Module progress
router.post('/module', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['moduleId', 'status'])) return;
    const { studentId } = req.student;
    const progress = await progressService.upsertModuleProgress({
      studentId,
      moduleId: req.body.moduleId,
      status: req.body.status,
    });
    res.status(201).json(progress);
  } catch (err) {
    next(err);
  }
});

// Check whether a student can start a module (prerequisite enforcement)
router.get('/module/:moduleId/prerequisites/check', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    const { studentId } = req.student;
    const check = await progressService.checkModulePrerequisites(studentId, req.params.moduleId);
    res.json(check);
  } catch (err) {
    next(err);
  }
});

router.get('/module/:moduleId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    const { studentId } = req.student;
    const progress = await progressService.getModuleProgress(studentId, req.params.moduleId);
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (err) {
    next(err);
  }
});

router.get('/module', authenticate, async (req, res, next) => {
  try {
    const { studentId } = req.student;
    const progress = await progressService.listModuleProgressByStudent(studentId);
    res.json(progress);
  } catch (err) {
    next(err);
  }
});

export default router;