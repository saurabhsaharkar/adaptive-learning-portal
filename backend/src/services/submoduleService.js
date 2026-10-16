import { pool } from '../db.js';

export async function createSubmodule({ moduleId, title, description, position }) {
  const result = await pool.query(
    `INSERT INTO submodules (module_id, title, description, position)
     VALUES ($1, $2, $3, $4)
     RETURNING id, module_id, title, description, position, created_at`,
    [moduleId, title, description, position]
  );
  return result.rows[0];
}

export async function getSubmoduleById(submoduleId) {
  const result = await pool.query(
    `SELECT id, module_id, title, description, position, created_at
     FROM submodules WHERE id = $1`,
    [submoduleId]
  );
  return result.rows[0] || null;
}

export async function listSubmodulesByModule(moduleId) {
  const result = await pool.query(
    `SELECT id, module_id, title, description, position, created_at
     FROM submodules WHERE module_id = $1
     ORDER BY position ASC`,
    [moduleId]
  );
  return result.rows;
}

export async function updateSubmodule(submoduleId, { title, description, position }) {
  const result = await pool.query(
    `UPDATE submodules
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         position = COALESCE($3, position)
     WHERE id = $4
     RETURNING id, module_id, title, description, position, updated_at`,
    [title, description, position, submoduleId]
  );
  return result.rows[0] || null;
}

export async function deleteSubmodule(submoduleId) {
  const result = await pool.query(`DELETE FROM submodules WHERE id = $1 RETURNING id`, [submoduleId]);
  return result.rows[0] || null;
}