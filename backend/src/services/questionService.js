import { pool } from '../db.js';

/**
 * MCQ questions (activity_questions) and student attempts (question_attempts).
 */
export async function createQuestion({ activityId, questionText, options, correctOptionId, explanation, position }) {
  const result = await pool.query(
    `INSERT INTO activity_questions (activity_id, question_text, options, correct_option_id, explanation, position)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, activity_id, question_text, options, correct_option_id, explanation, position`,
    [activityId, questionText, JSON.stringify(options), correctOptionId, explanation, position]
  );
  return result.rows[0];
}

export async function getQuestionById(questionId) {
  const result = await pool.query(
    `SELECT id, activity_id, question_text, options, correct_option_id, explanation, position
     FROM activity_questions WHERE id = $1`,
    [questionId]
  );
  return result.rows[0] || null;
}

export async function listQuestionsByActivity(activityId) {
  const result = await pool.query(
    `SELECT id, activity_id, question_text, options, correct_option_id, explanation, position
     FROM activity_questions WHERE activity_id = $1
     ORDER BY position ASC`,
    [activityId]
  );
  return result.rows;
}

export async function updateQuestion(questionId, fields) {
  const keys = ['question_text', 'options', 'correct_option_id', 'explanation', 'position'];
  const setParts = [];
  const values = [];
  let idx = 1;

  for (const key of keys) {
    if (fields[key] !== undefined) {
      let val = fields[key];
      if (key === 'options') val = JSON.stringify(val);
      setParts.push(`${key} = $${idx++}`);
      values.push(val);
    }
  }

  if (setParts.length === 0) return getQuestionById(questionId);

  values.push(questionId);
  const result = await pool.query(
    `UPDATE activity_questions SET ${setParts.join(', ')} WHERE id = $${idx}
     RETURNING id, activity_id, question_text, options, correct_option_id, explanation, position`,
    values
  );
  return result.rows[0] || null;
}

export async function deleteQuestion(questionId) {
  const result = await pool.query(`DELETE FROM activity_questions WHERE id = $1 RETURNING id`, [questionId]);
  return result.rows[0] || null;
}

export async function recordAttempt({ studentId, questionId, attemptNumber, selectedOptionId, isCorrect }) {
  const result = await pool.query(
    `INSERT INTO question_attempts (student_id, question_id, attempt_number, selected_option_id, is_correct)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, student_id, question_id, attempt_number, selected_option_id, is_correct, submitted_at`,
    [studentId, questionId, attemptNumber, selectedOptionId, isCorrect]
  );
  return result.rows[0];
}

export async function listAttemptsByQuestion(studentId, questionId) {
  const result = await pool.query(
    `SELECT id, student_id, question_id, attempt_number, selected_option_id, is_correct, submitted_at
     FROM question_attempts
     WHERE student_id = $1 AND question_id = $2
     ORDER BY attempt_number ASC`,
    [studentId, questionId]
  );
  return result.rows;
}