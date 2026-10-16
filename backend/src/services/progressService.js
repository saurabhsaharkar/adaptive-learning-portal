import { pool } from '../db.js';

/**
 * Student activity progress + student module progress.
 *
 * Includes:
 *  - prerequisite enforcement (a module cannot start until its prerequisites are completed)
 *  - module auto-completion (when all activities in a module are done, mark module completed)
 */

/** Check whether a student can start a module (all prerequisites completed). */
export async function checkModulePrerequisites(studentId, moduleId) {
  const prereqRes = await pool.query(
    `SELECT prerequisite_module_id FROM module_prerequisites WHERE module_id = $1`,
    [moduleId]
  );

  if (prereqRes.rows.length === 0) {
    return { canStart: true, missingPrerequisites: [] };
  }

  const missing = [];
  for (const row of prereqRes.rows) {
    const prog = await pool.query(
      `SELECT status FROM student_module_progress
       WHERE student_id = $1 AND module_id = $2`,
      [studentId, row.prerequisite_module_id]
    );
    if (prog.rows.length === 0 || prog.rows[0].status !== 'completed') {
      missing.push(row.prerequisite_module_id);
    }
  }

  return { canStart: missing.length === 0, missingPrerequisites: missing };
}

/** Auto-complete a module if all its activities are completed for the student. */
export async function autoCompleteModuleIfReady(studentId, moduleId) {
  // Gather all activity ids in this module (via submodules)
  const activitiesRes = await pool.query(
    `SELECT a.id
     FROM activities a
     JOIN submodules s ON s.id = a.submodule_id
     WHERE s.module_id = $1`,
    [moduleId]
  );

  if (activitiesRes.rows.length === 0) {
    return null; // no activities -> nothing to auto-complete
  }

  const activityIds = activitiesRes.rows.map((r) => r.id);

  // Check completion status per activity for this student
  const progressRes = await pool.query(
    `SELECT activity_id, status FROM student_activity_progress
     WHERE student_id = $1 AND activity_id = ANY($2::uuid[])`,
    [studentId, activityIds]
  );

  const completedSet = new Set(
    progressRes.rows
      .filter((r) => r.status === 'completed')
      .map((r) => r.activity_id)
  );

  const allCompleted = activityIds.every((id) => completedSet.has(id));

  if (!allCompleted) return null;

  // Mark module completed
  const result = await pool.query(
    `INSERT INTO student_module_progress (student_id, module_id, status, updated_at, completed_at)
     VALUES ($1, $2, 'completed', NOW(), NOW())
     ON CONFLICT (student_id, module_id)
     DO UPDATE SET status = 'completed', updated_at = NOW(), completed_at = NOW()
     RETURNING student_id, module_id, status, completed_at, updated_at`,
    [studentId, moduleId]
  );
  return result.rows[0];
}

export async function upsertActivityProgress({ studentId, activityId, status }) {
  const result = await pool.query(
    `INSERT INTO student_activity_progress (student_id, activity_id, status, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (student_id, activity_id)
     DO UPDATE SET status = EXCLUDED.status, updated_at = NOW(),
         completed_at = CASE WHEN EXCLUDED.status = 'completed' AND student_activity_progress.status <> 'completed'
                             THEN NOW() ELSE student_activity_progress.completed_at END
     RETURNING student_id, activity_id, status, completed_at, updated_at`,
    [studentId, activityId, status]
  );

  // If this activity was just completed, check whether the containing module is now fully done.
  if (status === 'completed') {
    const activityRes = await pool.query(
      `SELECT m.id AS module_id
       FROM activities a
       JOIN submodules s ON s.id = a.submodule_id
       JOIN modules m ON m.id = s.module_id
       WHERE a.id = $1`,
      [activityId]
    );
    if (activityRes.rows.length > 0) {
      await autoCompleteModuleIfReady(studentId, activityRes.rows[0].module_id);
    }
  }

  return result.rows[0];
}

export async function getActivityProgress(studentId, activityId) {
  const result = await pool.query(
    `SELECT student_id, activity_id, status, completed_at, updated_at
     FROM student_activity_progress WHERE student_id = $1 AND activity_id = $2`,
    [studentId, activityId]
  );
  return result.rows[0] || null;
}

export async function listActivityProgressByStudent(studentId) {
  const result = await pool.query(
    `SELECT student_id, activity_id, status, completed_at, updated_at
     FROM student_activity_progress WHERE student_id = $1`,
    [studentId]
  );
  return result.rows;
}

export async function upsertModuleProgress({ studentId, moduleId, status }) {
  // Prerequisite enforcement: a module cannot move to 'in_progress' unless
  // all its prerequisite modules are already completed.
  if (status === 'in_progress') {
    const prereqCheck = await checkModulePrerequisites(studentId, moduleId);
    if (!prereqCheck.canStart) {
      const err = new Error(
        `Cannot start module: prerequisite modules not completed (${prereqCheck.missingPrerequisites.join(', ')})`
      );
      err.statusCode = 409;
      throw err;
    }
  }

  const result = await pool.query(
    `INSERT INTO student_module_progress (student_id, module_id, status, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (student_id, module_id)
     DO UPDATE SET status = EXCLUDED.status, updated_at = NOW(),
         completed_at = CASE WHEN EXCLUDED.status = 'completed' AND student_module_progress.status <> 'completed'
                             THEN NOW() ELSE student_module_progress.completed_at END
     RETURNING student_id, module_id, status, completed_at, updated_at`,
    [studentId, moduleId, status]
  );
  return result.rows[0];
}

export async function getModuleProgress(studentId, moduleId) {
  const result = await pool.query(
    `SELECT student_id, module_id, status, completed_at, updated_at
     FROM student_module_progress WHERE student_id = $1 AND module_id = $2`,
    [studentId, moduleId]
  );
  return result.rows[0] || null;
}

export async function listModuleProgressByStudent(studentId) {
  const result = await pool.query(
    `SELECT student_id, module_id, status, completed_at, updated_at
     FROM student_module_progress WHERE student_id = $1`,
    [studentId]
  );
  return result.rows;
}