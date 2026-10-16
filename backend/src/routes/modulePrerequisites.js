import express from "express";

import {
  getModulePrerequisites,
  getDependentModules,
  addModulePrerequisite,
  removeModulePrerequisite,
} from "../services/modulePrerequisites.js";

const router = express.Router();

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/module-prerequisites/module/:moduleId
router.get(
  "/module/:moduleId",
  asyncHandler(async (req, res) => {
    const prerequisites = await getModulePrerequisites(req.params.moduleId);

    res.status(200).json({ prerequisites });
  }),
);

// GET /api/module-prerequisites/dependents/:moduleId
router.get(
  "/dependents/:moduleId",
  asyncHandler(async (req, res) => {
    const modules = await getDependentModules(req.params.moduleId);

    res.status(200).json({ modules });
  }),
);

// POST /api/module-prerequisites
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { module_id, prerequisite_module_id } = req.body;

    const relationship = await addModulePrerequisite(
      module_id,
      prerequisite_module_id,
    );

    res.status(201).json({ relationship });
  }),
);

// DELETE /api/module-prerequisites
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { module_id, prerequisite_module_id } = req.body;

    const result = await removeModulePrerequisite(
      module_id,
      prerequisite_module_id,
    );

    res.status(200).json(result);
  }),
);

export default router;
