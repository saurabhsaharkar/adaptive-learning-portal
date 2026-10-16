import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

async function runSchema() {
  const schemaPath = path.resolve(process.cwd(), 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    console.log('Applying schema...');
    await client.query(sql);
    console.log('Schema applied successfully.');
  } catch (err) {
    console.error('Failed to apply schema:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function runSeed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create a sample course
    const courseRes = await client.query(
      `INSERT INTO courses (title, description)
       VALUES ($1, $2)
       RETURNING id, title`,
      ['Introduction to Adaptive Learning', 'A sample course to demonstrate the adaptive learning portal.']
    );
    const courseId = courseRes.rows[0].id;
    console.log('Seeded course:', courseId);

    // Create a sample module
    const moduleRes = await client.query(
      `INSERT INTO modules (course_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, title`,
      [courseId, 'Module 1: Foundations', 'Foundational concepts for adaptive learning.']
    );
    const moduleId = moduleRes.rows[0].id;
    console.log('Seeded module:', moduleId);

    // Create submodules
    const sub1 = await client.query(
      `INSERT INTO submodules (module_id, title, description, position)
       VALUES ($1, $2, $3, 1) RETURNING id`,
      [moduleId, 'Submodule 1.1', 'Introduction', 1]
    );
    const sub2 = await client.query(
      `INSERT INTO submodules (module_id, title, description, position)
       VALUES ($1, $2, $3, 2) RETURNING id`,
      [moduleId, 'Submodule 1.2', 'Deep dive', 2]
    );
    const sub1Id = sub1.rows[0].id;
    const sub2Id = sub2.rows[0].id;

    // Activity with JSON content (learn type)
    const learnContent = {
      blocks: [
        { kind: 'text', text: 'Welcome to adaptive learning!' },
        { kind: 'video', url: 'https://example.com/video1.mp4' },
        { kind: 'checkpoint', prompt: 'What did you learn?' }
      ]
    };
    const learnActivity = await client.query(
      `INSERT INTO activities (submodule_id, title, type, content, position)
       VALUES ($1, $2, $3, $4, 1) RETURNING id`,
      [sub1Id, 'Welcome Activity', 'learn', JSON.stringify(learnContent)]
    );
    const learnActivityId = learnActivity.rows[0].id;

    // Activity with JSON content (practice type) - MCQ
    const practiceContent = {
      instructions: 'Answer the following question.',
      hint: 'Think about the foundations.'
    };
    const practiceActivity = await client.query(
      `INSERT INTO activities (submodule_id, title, type, content, position)
       VALUES ($1, $2, $3, $4, 1) RETURNING id`,
      [sub2Id, 'Practice Quiz', 'practice', JSON.stringify(practiceContent)]
    );
    const practiceActivityId = practiceActivity.rows[0].id;

    // MCQ questions for the practice activity
    await client.query(
      `INSERT INTO activity_questions (activity_id, question_text, options, correct_option_id, explanation, position)
       VALUES ($1, $2, $3, $4, $5, 1)`,
      [
        practiceActivityId,
        'What is adaptive learning?',
        JSON.stringify([
          { id: 'A', text: 'Learning that adapts to the learner' },
          { id: 'B', text: 'Learning only in classrooms' },
          { id: 'C', text: 'Learning without technology' },
          { id: 'D', text: 'Learning at fixed pace' }
        ]),
        'A',
        'Adaptive learning tailors the experience to each learner.',
      ]
    );

    // Assessment activity
    const assessContent = {
      instructions: 'Complete the assessment.',
      timeLimitMinutes: 10
    };
    await client.query(
      `INSERT INTO activities (submodule_id, title, type, content, position)
       VALUES ($1, $2, $3, $4, 2) RETURNING id`,
      [sub2Id, 'Final Assessment', 'assessment', JSON.stringify(assessContent)]
    );

    // Chatbot questions for the module
    await client.query(
      `INSERT INTO module_chatbot_questions (module_id, question_text, expected_concepts, evaluation_criteria, position)
       VALUES ($1, $2, $3, $4, 1)`,
      [
        moduleId,
        'Explain the core idea of adaptive learning.',
        JSON.stringify(['personalization', 'mastery-based progression', 'feedback loops']),
        'Student mentions personalization and adapting to learner needs.'
      ]
    );
    await client.query(
      `INSERT INTO module_chatbot_questions (module_id, question_text, expected_concepts, evaluation_criteria, position)
       VALUES ($1, $2, $3, $4, 2)`,
      [
        moduleId,
        'Why is mastery-based progression important?',
        JSON.stringify(['mastery', 'progression', 'gaps']),
        'Student explains that learners must master before advancing.'
      ]
    );

    await client.query('COMMIT');
    console.log('Seed data inserted successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to seed data:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  const mode = process.argv[2] || 'schema';

  try {
    if (mode === 'seed') {
      await runSeed();
    } else {
      await runSchema();
      console.log('Schema init complete. Run `npm run db:seed` to add sample data.');
    }
  } catch (err) {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();