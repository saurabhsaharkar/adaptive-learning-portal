import { pool } from '../db.js';

/**
 * Predetermined chatbot questions, sessions, messages, and per-question results.
 */
export async function createChatbotQuestion({ moduleId, questionText, expectedConcepts = [], evaluationCriteria, position }) {
  const result = await pool.query(
    `INSERT INTO module_chatbot_questions (module_id, question_text, expected_concepts, evaluation_criteria, position)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, module_id, question_text, expected_concepts, evaluation_criteria, position`,
    [moduleId, questionText, JSON.stringify(expectedConcepts), evaluationCriteria, position]
  );
  return result.rows[0];
}

export async function listChatbotQuestions(moduleId) {
  const result = await pool.query(
    `SELECT id, module_id, question_text, expected_concepts, evaluation_criteria, position
     FROM module_chatbot_questions WHERE module_id = $1
     ORDER BY position ASC`,
    [moduleId]
  );
  return result.rows;
}

export async function createSession({ studentId, moduleId }) {
  const result = await pool.query(
    `INSERT INTO module_chat_sessions (student_id, module_id, status, current_question_position)
     VALUES ($1, $2, 'in_progress', 1)
     RETURNING id, student_id, module_id, status, current_question_position, started_at`,
    [studentId, moduleId]
  );
  return result.rows[0];
}

export async function getSession(sessionId) {
  const result = await pool.query(
    `SELECT id, student_id, module_id, status, current_question_position, started_at, completed_at
     FROM module_chat_sessions WHERE id = $1`,
    [sessionId]
  );
  return result.rows[0] || null;
}

export async function updateSessionStatus(sessionId, status) {
  const result = await pool.query(
    `UPDATE module_chat_sessions
     SET status = $1, completed_at = CASE WHEN $1 IN ('passed','failed') THEN NOW() ELSE completed_at END
     WHERE id = $2
     RETURNING id, status, completed_at`,
    [status, sessionId]
  );
  return result.rows[0] || null;
}

export async function advanceSessionQuestion(sessionId) {
  const result = await pool.query(
    `UPDATE module_chat_sessions
     SET current_question_position = current_question_position + 1
     WHERE id = $1
     RETURNING id, current_question_position`,
    [sessionId]
  );
  return result.rows[0];
}

export async function addMessage({ sessionId, questionId, sender, message, evaluation }) {
  const result = await pool.query(
    `INSERT INTO module_chat_messages (session_id, question_id, sender, message, evaluation)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, session_id, question_id, sender, message, evaluation, created_at`,
    [sessionId, questionId, sender, message, evaluation ? JSON.stringify(evaluation) : null]
  );
  return result.rows[0];
}

export async function listMessages(sessionId) {
  const result = await pool.query(
    `SELECT id, session_id, question_id, sender, message, evaluation, created_at
     FROM module_chat_messages WHERE session_id = $1
     ORDER BY created_at ASC`,
    [sessionId]
  );
  return result.rows;
}

export async function upsertQuestionResult({ sessionId, questionId, status, evaluation }) {
  const result = await pool.query(
    `INSERT INTO module_chat_question_results (session_id, question_id, status, evaluation, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (session_id, question_id)
     DO UPDATE SET status = EXCLUDED.status, evaluation = EXCLUDED.evaluation, updated_at = NOW()
     RETURNING session_id, question_id, status, evaluation, updated_at`,
    [sessionId, questionId, status, evaluation ? JSON.stringify(evaluation) : null]
  );
  return result.rows[0];
}

export async function listQuestionResults(sessionId) {
  const result = await pool.query(
    `SELECT session_id, question_id, status, evaluation, updated_at
     FROM module_chat_question_results WHERE session_id = $1`,
    [sessionId]
  );
  return result.rows;
}

/**
 * Get the next question a student should answer in a chatbot session.
 * Returns the lowest-position question (>= current_question_position) whose
 * result is not yet 'satisfactory', along with session state.
 */
export async function getNextQuestion(sessionId) {
  const session = await getSession(sessionId);
  if (!session) return null;

  const startPos = session.current_question_position;

  const result = await pool.query(
    `SELECT q.id, q.module_id, q.question_text, q.expected_concepts, q.evaluation_criteria, q.position
     FROM module_chatbot_questions q
     WHERE q.module_id = $1
       AND q.position >= $2
       AND NOT EXISTS (
         SELECT 1 FROM module_chat_question_results r
         WHERE r.session_id = $3 AND r.question_id = q.id AND r.status = 'satisfactory'
       )
     ORDER BY q.position ASC
     LIMIT 1`,
    [session.module_id, startPos, sessionId]
  );

  if (result.rows.length === 0) {
    return { session, nextQuestion: null, finished: true };
  }

  return { session, nextQuestion: result.rows[0], finished: false };
}