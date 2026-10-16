import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireBody, requireFields } from '../middleware/validate.js';
import * as studentService from '../services/studentService.js';

const router = express.Router();

// NOTE: Signup is now handled via POST /auth/signup (Supabase Auth).
// This route is kept for read-only student profile lookups only.

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
});

router.get('/', authenticate, async (_req, res, next) => {
  try {
    const students = await studentService.listStudents();
    res.json(students);
  } catch (err) {
    next(err);
  }
});

export default router;
