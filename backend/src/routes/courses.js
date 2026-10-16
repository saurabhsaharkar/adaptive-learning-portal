import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as courseService from '../services/courseService.js';

const router = express.Router();

router.get('/', authenticate, async (_req, res) => {
  const courses = await courseService.listCourses();
  res.json(courses);
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['title'])) return;
    const course = await courseService.createCourse(req.body);
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/content', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const content = await courseService.getCourseContent(req.params.id);
    if (!content) return res.status(404).json({ error: 'Course not found' });
    res.json(content);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const course = await courseService.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    const course = await courseService.updateCourse(req.params.id, req.body);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const deleted = await courseService.deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Course not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;