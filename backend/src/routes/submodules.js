import express from "express";

import {
  getAllSubmodules,
  getSubmodulesByModule,
  getSubmoduleById,
  createSubmodule,
  updateSubmodule,
  deleteSubmodule,
} from "../services/submodules.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/submodules
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const submodules = await getAllSubmodules();
    res.status(200).json({ submodules });
  }),
);

// GET /api/submodules/module/:moduleId
router.get(
  "/module/:moduleId",
  asyncHandler(async (req, res) => {
    const submodules = await getSubmodulesByModule(req.params.moduleId);

    res.status(200).json({ submodules });
  }),
);

// GET /api/submodules/:submoduleId
router.get(
  "/:submoduleId",
  asyncHandler(async (req, res) => {
    const submodule = await getSubmoduleById(req.params.submoduleId);

    res.status(200).json({ submodule });
  }),
);

// POST /api/submodules
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const submodule = await createSubmodule(req.body);
    res.status(201).json({ submodule });
  }),
);

// PATCH /api/submodules/:submoduleId
router.patch(
  "/:submoduleId",
  asyncHandler(async (req, res) => {
    const submodule = await updateSubmodule(req.params.submoduleId, req.body);

    res.status(200).json({ submodule });
  }),
);

// DELETE /api/submodules/:submoduleId
router.delete(
  "/:submoduleId",
  asyncHandler(async (req, res) => {
    const result = await deleteSubmodule(req.params.submoduleId);

    res.status(200).json(result);
  }),
);

export default router;
