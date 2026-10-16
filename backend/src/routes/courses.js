import express from "express";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courses.js";

const router = express.Router();

// Helper to forward async errors to Express error handling.
const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

// GET /api/courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await getAllCourses();
    res.status(200).json({ courses });
  }),
);

// GET /api/courses/:courseId
router.get(
  "/:courseId",
  asyncHandler(async (req, res) => {
    const course = await getCourseById(req.params.courseId);
    res.status(200).json({ course });
  }),
);

// POST /api/courses
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const course = await createCourse(req.body);
    res.status(201).json({ course });
  }),
);

// PATCH /api/courses/:courseId
router.patch(
  "/:courseId",
  asyncHandler(async (req, res) => {
    const course = await updateCourse(req.params.courseId, req.body);

    res.status(200).json({ course });
  }),
);

// DELETE /api/courses/:courseId
router.delete(
  "/:courseId",
  asyncHandler(async (req, res) => {
    const result = await deleteCourse(req.params.courseId);
    res.status(200).json(result);
  }),
);

export default router;
