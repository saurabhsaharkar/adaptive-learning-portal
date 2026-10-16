import { pool } from '../db.js';

export async function createStudent({ username, email }) {
  const result = await pool.query(
    `INSERT INTO students (username, email)
     VALUES ($1, $2)
     RETURNING id, username, email, created_at`,
    [username, email]
  );
  return result.rows[0];
}

export async function getStudentById(studentId) {
  const result = await pool.query(
    `SELECT id, username, email, created_at FROM students WHERE id = $1`,
    [studentId]
  );
  return result.rows[0] || null;
}

export async function listStudents() {
  const result = await pool.query(
    `SELECT id, username, email, created_at FROM students ORDER BY created_at DESC`
  );
  return result.rows;
}
