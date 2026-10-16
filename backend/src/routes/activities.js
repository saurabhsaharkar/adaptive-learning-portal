import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  requireBody,
  requireFields,
  validateUUID,
} from '../middleware/validate.js';
import * as activityService from '../services/activityService.js';

const router = express.Router();

/**
 * Activity Content APIs.
 * `content` is JSONB - any valid JSON can be stored and returned.
 *
 * POST    /api/activities
 * GET     /api/activities/:id
 * PUT     /api/activities/:id
 * PUT     /api/activities/:id/content
 * DELETE  /api/activities/:id
 * GET     /api/submodules/:submoduleId/activities
 * PUT     /api/submodules/:submoduleId/activities/reorder
 */

// Create an activity (content accepts arbitrary JSON)
router.post('/', authenticate, async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['submoduleId', 'title', 'type'])) return;

    const { submoduleId, title, type, content, position } = req.body;

    if (!validateUUID(res, submoduleId, 'submoduleId')) return;
    if (!['learn', 'practice', 'assessment'].includes(type)) {
      return res.status(400).json({ error: "type must be 'learn', 'practice', or 'assessment'" });
    }

    const activity = await activityService.createActivity({
      submoduleId,
      title,
      type,
      content: content || {},
      position,
    });
    res.status(201).json(activity);
  } catch (err) {
    next(err);
  }
});

// Get one activity (content returned as parsed JSON)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const activity = await activityService.getActivityById(req.params.id);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

// Update activity (title/type/position/content)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    const activity = await activityService.updateActivity(req.params.id, req.body);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    next(err);
  }
});

// Replace or deep-merge the activity content JSON
router.put('/:id/content', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['content'])) return;

    const { content, merge } = req.body;
    const updated = await activityService.updateActivityContent(req.params.id, content, { merge });
    if (!updated) return res.status(404).json({ error: 'Activity not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.id)) return;
    const deleted = await activityService.deleteActivity(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Activity not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// List activities within a submodule (ordered by position)
router.get('/submodule/:submoduleId', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.submoduleId)) return;
    const activities = await activityService.listActivitiesBySubmodule(req.params.submoduleId);
    res.json(activities);
  } catch (err) {
    next(err);
  }
});

// Reorder activities within a submodule
router.put('/submodule/:submoduleId/reorder', authenticate, async (req, res, next) => {
  try {
    if (!validateUUID(res, req.params.submoduleId)) return;
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['activityIds'])) return;

    const { activityIds } = req.body;
    if (!Array.isArray(activityIds) || activityIds.length === 0) {
      return res.status(400).json({ error: 'activityIds must be a non-empty array' });
    }

    await activityService.reorderActivities(req.params.submoduleId, activityIds);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;