import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields, validateUUID } from '../middleware/validate.js';
import * as submoduleService from '../services/submoduleService.js';

const router = express.Router();

router.get('/module/:moduleId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.moduleId)) return;
    const submodules = await submoduleService.listSubmodulesByModule(req.params.moduleId);
    res.json(submodules);
  } catch (err) {
    next(err);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['moduleId', 'title', 'position'])) return;
    if (!validateUUID(res, req.body.moduleId)) return;
    const submodule = await submoduleService.createSubmodule(req.body);
    res.status(201).json(submodule);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const submodule = await submoduleService.getSubmoduleById(req.params.id);
    if (!submodule) return res.status(404).json({ error: 'Submodule not found' });
    res.json(submodule);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    const submodule = await submoduleService.updateSubmodule(req.params.id, req.body);
    if (!submodule) return res.status(404).json({ error: 'Submodule not found' });
    res.json(submodule);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const deleted = await submoduleService.deleteSubmodule(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Submodule not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;