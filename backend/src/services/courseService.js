import { pool } from '../db.js';

/**
 * Fetch a course with its full nested content:
 * course -> modules -> submodules -> activities (with JSON content) -> MCQ questions.
 */
export async function getCourseContent(courseId) {
  const course = await getCourseById(courseId);
  if (!course) return null;

  const modules = await pool.query(
    `SELECT id, course_id, title, description, created_at
     FROM modules WHERE course_id = $1 ORDER BY created_at ASC`,
    [courseId]
  );

  for (const mod of modules.rows) {
    const submodules = await pool.query(
      `SELECT id, module_id, title, description, position, created_at
       FROM submodules WHERE module_id = $1 ORDER BY position ASC`,
      [mod.id]
    );

    for (const sub of submodules.rows) {
      const activities = await pool.query(
        `SELECT id, submodule_id, title, type, content, position, created_at
         FROM activities WHERE submodule_id = $1 ORDER BY position ASC`,
        [sub.id]
      );

      for (const act of activities.rows) {
        const questions = await pool.query(
          `SELECT id, activity_id, question_text, options, correct_option_id, explanation, position
           FROM activity_questions WHERE activity_id = $1 ORDER BY position ASC`,
          [act.id]
        );
        act.questions = questions.rows;
      }

      sub.activities = activities.rows;
    }

    mod.submodules = submodules.rows;
  }

  course.modules = modules.rows;
  return course;
}

export async function createCourse({ title, description }) {
  const result = await pool.query(
    `INSERT INTO courses (title, description)
     VALUES ($1, $2)
     RETURNING id, title, description, created_at`,
    [title, description]
  );
  return result.rows[0];
}

export async function getCourseById(courseId) {
  const result = await pool.query(
    `SELECT id, title, description, created_at FROM courses WHERE id = $1`,
    [courseId]
  );
  return result.rows[0] || null;
}

export async function listCourses() {
  const result = await pool.query(
    `SELECT id, title, description, created_at FROM courses ORDER BY created_at DESC`
  );
  return result.rows;
}

export async function updateCourse(courseId, { title, description }) {
  const result = await pool.query(
    `UPDATE courses
     SET title = COALESCE($1, title), description = COALESCE($2, description)
     WHERE id = $3
     RETURNING id, title, description, updated_at`,
    [title, description, courseId]
  );
  return result.rows[0] || null;
}

export async function deleteCourse(courseId) {
  const result = await pool.query(`DELETE FROM courses WHERE id = $1 RETURNING id`, [courseId]);
  return result.rows[0] || null;
}