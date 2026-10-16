import express from 'express';
import { requireBody, requireFields } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import * as authService from '../services/authService.js';

const router = express.Router();

// Public: sign up with email and password (auto-confirmed, instant login)
router.post('/signup', async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['email', 'password'])) return;

    const user = await authService.signup({
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// Public: log in with email and password, returns access token
router.post('/login', async (req, res, next) => {
  try {
    if (!requireBody(res, req.body)) return;
    if (!requireFields(res, req.body, ['email', 'password'])) return;

    const { user, session } = await authService.login({
      email: req.body.email,
      password: req.body.password,
    });

    res.json({ user, session });
  } catch (err) {
    next(err);
  }
});

// Protected: get the currently authenticated student's profile
router.get('/me', authenticate, async (_req, res) => {
  const { id } = req.student;
  res.json({ id, email: req.student.email });
});

// Public: log out (client should discard the access token)
router.post('/logout', async (_req, res) => {
  res.json({ message: 'Logged out' });
});

export default router;