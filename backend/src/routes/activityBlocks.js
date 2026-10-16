import express from "express";

import {
  getAllActivityBlocks,
  getActivityBlocksByActivity,
  getActivityBlockById,
  createActivityBlock,
  updateActivityBlock,
  deleteActivityBlock,
} from "../services/activityBlocks.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/activity-blocks
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const blocks = await getAllActivityBlocks();
    res.status(200).json({ blocks });
  }),
);

// GET /api/activity-blocks/activity/:activityId
router.get(
  "/activity/:activityId",
  asyncHandler(async (req, res) => {
    const blocks = await getActivityBlocksByActivity(req.params.activityId);

    res.status(200).json({ blocks });
  }),
);

// GET /api/activity-blocks/:blockId
router.get(
  "/:blockId",
  asyncHandler(async (req, res) => {
    const block = await getActivityBlockById(req.params.blockId);
    res.status(200).json({ block });
  }),
);

// POST /api/activity-blocks
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const block = await createActivityBlock(req.body);
    res.status(201).json({ block });
  }),
);

// PATCH /api/activity-blocks/:blockId
router.patch(
  "/:blockId",
  asyncHandler(async (req, res) => {
    const block = await updateActivityBlock(req.params.blockId, req.body);

    res.status(200).json({ block });
  }),
);

// DELETE /api/activity-blocks/:blockId
router.delete(
  "/:blockId",
  asyncHandler(async (req, res) => {
    const result = await deleteActivityBlock(req.params.blockId);
    res.status(200).json(result);
  }),
);

export default router;
