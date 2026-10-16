import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as moduleService from '../services/moduleService.js';

const router = express.Router();

router.get('/course/:courseId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.courseId)) return;
    const modules = await moduleService.listModulesByCourse(req.params.courseId);
    res.json(modules);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['courseId', 'title'])) return;
    if (!validateUUID(res, req.body.courseId)) return;
    const module = await moduleService.createModule(req.body);
    res.status(201).json(module);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const module = await moduleService.getModuleById(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    const module = await moduleService.updateModule(req.params.id, req.body);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const deleted = await moduleService.deleteModule(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Module not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.post('/:moduleId/prerequisites', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['prerequisiteModuleId'])) return;
    if (!validateUUID(res, req.body.prerequisiteModuleId)) return;
    const prerequisite = await moduleService.addPrerequisite(
      req.params.moduleId,
      req.body.prerequisiteModuleId
    );
    res.status(201).json(prerequisite);
  } catch (err) {
    next(err);
  }
});

router.delete('/:moduleId/prerequisites/:prerequisiteModuleId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    if (!validateUUID(res, req.params.prerequisiteModuleId)) return;
    const deleted = await moduleService.removePrerequisite(
      req.params.moduleId,
      req.params.prerequisiteModuleId
    );
    if (!deleted) return res.status(404).json({ error: 'Prerequisite not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get('/:moduleId/prerequisites', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    const prerequisites = await moduleService.listPrerequisites(req.params.moduleId);
    res.json(prerequisites);
  } catch (err) {
    next(err);
  }
});

export default router;