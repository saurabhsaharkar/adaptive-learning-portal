/**
 * Authentication middleware.
 *
 * Supports two modes controlled by AUTH_MODE env var:
 *  - 'header' (default): reads student_id from X-Student-Id header.
 *  - 'jwt': expects Authorization: Bearer <token> and verifies it with Supabase Auth.
 *
 * For now the JWT path is wired to Supabase without changing routes or services.
 */
import dotenv from 'dotenv';
import { getUserFromToken } from '../services/authService.js';

dotenv.config();

const AUTH_MODE = process.env.AUTH_MODE || 'header';

export async function authenticate(req, res, next) {
  try {
    let studentId = null;
    let studentEmail = null;

    if (AUTH_MODE === 'jwt') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
      }
      const token = authHeader.split(' ')[1];
      const user = await getUserFromToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      studentId = user.id;
      studentEmail = user.email;
    } else {
      // header mode: X-Student-Id
      studentId = req.headers['x-student-id'];
    }

    if (!studentId) {
      return res.status(401).json({ error: 'Authentication required: student_id not provided' });
    }

    req.student = { id: studentId, email: studentEmail };
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    let studentId = null;
    let studentEmail = null;

    if (process.env.AUTH_MODE === 'jwt') {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
          const user = await getUserFromToken(token);
          if (user) {
            studentId = user.id;
            studentEmail = user.email;
          }
        } catch {
          // token invalid -> treat as unauthenticated, continue without user
        }
      }
    } else {
      studentId = req.headers['x-student-id'];
    }
    if (studentId) {
      req.student = { id: studentId, email: studentEmail };
    }
    next();
  } catch (err) {
    next(err);
  }
}