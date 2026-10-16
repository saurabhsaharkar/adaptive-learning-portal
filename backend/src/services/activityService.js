import { pool } from '../db.js';

/**
 * Activity service.
 * activities.content is JSONB - pg driver serializes/deserializes it automatically.
 * Any valid JSON object can be stored/retrieved via the `content` field.
 */
export async function createActivity({ submoduleId, title, type, content = {}, position }) {
  const result = await pool.query(
    `INSERT INTO activities (submodule_id, title, type, content, position)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, submodule_id, title, type, content, position, created_at`,
    [submoduleId, title, type, JSON.stringify(content), position]
  );
  return result.rows[0];
}

export async function getActivityById(activityId) {
  const result = await pool.query(
    `SELECT id, submodule_id, title, type, content, position, created_at
     FROM activities WHERE id = $1`,
    [activityId]
  );
  return result.rows[0] || null;
}

export async function listActivitiesBySubmodule(submoduleId) {
  const result = await pool.query(
    `SELECT id, submodule_id, title, type, content, position, created_at
     FROM activities
     WHERE submodule_id = $1
     ORDER BY position ASC`,
    [submoduleId]
  );
  return result.rows;
}

export async function updateActivity(activityId, { title, type, content, position }) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (type !== undefined) { fields.push(`type = $${idx++}`); values.push(type); }
  if (content !== undefined) { fields.push(`content = $${idx++}`); values.push(JSON.stringify(content)); }
  if (position !== undefined) { fields.push(`position = $${idx++}`); values.push(position); }

  if (fields.length === 0) {
    return getActivityById(activityId);
  }

  values.push(activityId);
  const result = await pool.query(
    `UPDATE activities
     SET ${fields.join(', ')}
     WHERE id = $${idx}
     RETURNING id, submodule_id, title, type, content, position, updated_at`,
    values
  );
  return result.rows[0] || null;
}

export async function updateActivityContent(activityId, content, { merge = false } = {}) {
  let targetContent = content;
  if (merge) {
    const existing = await getActivityById(activityId);
    if (!existing) return null;
    targetContent = { ...existing.content, ...content };
  }
  return updateActivity(activityId, { content: targetContent });
}

export async function deleteActivity(activityId) {
  const result = await pool.query(
    `DELETE FROM activities WHERE id = $1 RETURNING id`,
    [activityId]
  );
  return result.rows[0] || null;
}

export async function reorderActivities(submoduleId, orderedActivityIds) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedActivityIds.length; i++) {
      await client.query(
        `UPDATE activities SET position = $1 WHERE id = $2 AND submodule_id = $3`,
        [i + 1, orderedActivityIds[i], submoduleId]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  return { success: true };
}