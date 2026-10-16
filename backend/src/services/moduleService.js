import { pool } from '../db.js';

export async function createModule({ courseId, title, description }) {
  const result = await pool.query(
    `INSERT INTO modules (course_id, title, description)
     VALUES ($1, $2, $3)
     RETURNING id, course_id, title, description, created_at`,
    [courseId, title, description]
  );
  return result.rows[0];
}

export async function getModuleById(moduleId) {
  const result = await pool.query(
    `SELECT id, course_id, title, description, created_at FROM modules WHERE id = $1`,
    [moduleId]
  );
  return result.rows[0] || null;
}

export async function listModulesByCourse(courseId) {
  const result = await pool.query(
    `SELECT id, course_id, title, description, created_at
     FROM modules WHERE course_id = $1 ORDER BY created_at ASC`,
    [courseId]
  );
  return result.rows;
}

export async function updateModule(moduleId, { courseId, title, description }) {
  const result = await pool.query(
    `UPDATE modules
     SET course_id = COALESCE($1, course_id),
         title = COALESCE($2, title),
         description = COALESCE($3, description)
     WHERE id = $4
     RETURNING id, course_id, title, description, updated_at`,
    [courseId, title, description, moduleId]
  );
  return result.rows[0] || null;
}

export async function deleteModule(moduleId) {
  const result = await pool.query(`DELETE FROM modules WHERE id = $1 RETURNING id`, [moduleId]);
  return result.rows[0] || null;
}

export async function addPrerequisite(moduleId, prerequisiteModuleId) {
  const result = await pool.query(
    `INSERT INTO module_prerequisites (module_id, prerequisite_module_id)
     VALUES ($1, $2)
     RETURNING module_id, prerequisite_module_id`,
    [moduleId, prerequisiteModuleId]
  );
  return result.rows[0];
}

export async function removePrerequisite(moduleId, prerequisiteModuleId) {
  const result = await pool.query(
    `DELETE FROM module_prerequisites
     WHERE module_id = $1 AND prerequisite_module_id = $2
     RETURNING module_id, prerequisite_module_id`,
    [moduleId, prerequisiteModuleId]
  );
  return result.rows[0] || null;
}

export async function listPrerequisites(moduleId) {
  const result = await pool.query(
    `SELECT prerequisite_module_id FROM module_prerequisites WHERE module_id = $1`,
    [moduleId]
  );
  return result.rows.map((r) => r.prerequisite_module_id);
}