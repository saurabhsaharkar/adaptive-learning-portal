import express from "express";

import {
  getAllActivities,
  getActivitiesBySubmodule,
  getActivitiesByModule, // Add this
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../services/activities.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/activities
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const activities = await getAllActivities();
    res.status(200).json({ activities });
  }),
);

// GET /api/activities/submodule/:submoduleId
router.get(
  "/submodule/:submoduleId",
  asyncHandler(async (req, res) => {
    const activities = await getActivitiesBySubmodule(req.params.submoduleId);

    res.status(200).json({ activities });
  }),
);

// GET /api/activities/:activityId
router.get(
  "/:activityId",
  asyncHandler(async (req, res) => {
    const activity = await getActivityById(req.params.activityId);
    res.status(200).json({ activity });
  }),
);

// POST /api/activities
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const activity = await createActivity(req.body);
    res.status(201).json({ activity });
  }),
);

router.get("/module/:moduleId", async (req, res, next) => {
  try {
    const activities = await getActivitiesByModule(req.params.moduleId);

    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId
router.patch(
  "/:activityId",
  asyncHandler(async (req, res) => {
    const activity = await updateActivity(req.params.activityId, req.body);

    res.status(200).json({ activity });
  }),
);

// DELETE /api/activities/:activityId
router.delete(
  "/:activityId",
  asyncHandler(async (req, res) => {
    const result = await deleteActivity(req.params.activityId);
    res.status(200).json(result);
  }),
);

export default router;
