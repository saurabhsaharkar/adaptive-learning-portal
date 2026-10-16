import express from "express";

import {
  getAllModules,
  getModulesByCourse,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "../services/modules.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/modules
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const modules = await getAllModules();
    res.status(200).json({ modules });
  }),
);

// GET /api/modules/course/:courseId
router.get(
  "/course/:courseId",
  asyncHandler(async (req, res) => {
    const modules = await getModulesByCourse(req.params.courseId);
    res.status(200).json({ modules });
  }),
);

// GET /api/modules/:moduleId
router.get(
  "/:moduleId",
  asyncHandler(async (req, res) => {
    const module = await getModuleById(req.params.moduleId);
    res.status(200).json({ module });
  }),
);

// POST /api/modules
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const module = await createModule(req.body);
    res.status(201).json({ module });
  }),
);

// PATCH /api/modules/:moduleId
router.patch(
  "/:moduleId",
  asyncHandler(async (req, res) => {
    const module = await updateModule(req.params.moduleId, req.body);

    res.status(200).json({ module });
  }),
);

// DELETE /api/modules/:moduleId
router.delete(
  "/:moduleId",
  asyncHandler(async (req, res) => {
    const result = await deleteModule(req.params.moduleId);
    res.status(200).json(result);
  }),
);

export default router;
