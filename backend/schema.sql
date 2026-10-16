-- Adaptive Learning Portal Database Schema
-- Run: psql -d adaptive_learning -f backend/schema.sql
-- Or via backend script: npm run db:init

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 0. Students (profiles)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1. Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT
);

-- 2. Modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL
        REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT
);

-- 3. Module prerequisites (concept map)
-- module_id depends on prerequisite_module_id
CREATE TABLE module_prerequisites (
    module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,
    prerequisite_module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,

    PRIMARY KEY (module_id, prerequisite_module_id),
    CHECK (module_id <> prerequisite_module_id)
);

-- 4. Submodules within each module
CREATE TABLE submodules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL CHECK (position > 0),

    UNIQUE (module_id, position)
);

-- 5. Activities within each submodule
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submodule_id UUID NOT NULL
        REFERENCES submodules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL
        CHECK (type IN ('learn', 'practice', 'assessment')),
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    position INTEGER NOT NULL CHECK (position > 0),

    UNIQUE (submodule_id, position)
);

-- 6. Student activity progress
CREATE TABLE student_activity_progress (
    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_id UUID NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started'
        CHECK (status IN (
            'not_started',
            'in_progress',
            'completed',
            'skipped'
        )),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (student_id, activity_id)
);

-- 7. Student module progress
CREATE TABLE student_module_progress (
    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started'
        CHECK (status IN (
            'not_started',
            'in_progress',
            'completed'
        )),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (student_id, module_id)
);

-- 8. MCQ questions belonging to an activity
CREATE TABLE activity_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL
        REFERENCES activities(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_option_id TEXT NOT NULL,
    explanation TEXT,
    position INTEGER NOT NULL CHECK (position > 0),

    UNIQUE (activity_id, position)
);

-- 9. Student MCQ attempts
CREATE TABLE question_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL
        REFERENCES activity_questions(id) ON DELETE CASCADE,

    attempt_number INTEGER NOT NULL CHECK (attempt_number > 0),
    selected_option_id TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (student_id, question_id, attempt_number)
);

-- 10. Predetermined chatbot questions for each module
CREATE TABLE module_chatbot_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,

    question_text TEXT NOT NULL,
    expected_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
    evaluation_criteria TEXT,
    position INTEGER NOT NULL CHECK (position > 0),

    UNIQUE (module_id, position)
);

-- 11. Student chatbot evaluation sessions
-- Each row represents one evaluation attempt.
CREATE TABLE module_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL
        REFERENCES modules(id) ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (status IN (
            'in_progress',
            'passed',
            'failed'
        )),

    current_question_position INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 12. Chatbot conversation messages
CREATE TABLE module_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL
        REFERENCES module_chat_sessions(id) ON DELETE CASCADE,
    question_id UUID
        REFERENCES module_chatbot_questions(id) ON DELETE SET NULL,

    sender TEXT NOT NULL
        CHECK (sender IN ('student', 'assistant')),
    message TEXT NOT NULL,
    evaluation JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Result for each predetermined question in a session
CREATE TABLE module_chat_question_results (
    session_id UUID NOT NULL
        REFERENCES module_chat_sessions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL
        REFERENCES module_chatbot_questions(id) ON DELETE CASCADE,

    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN (
            'pending',
            'satisfactory',
            'needs_improvement'
        )),
    evaluation JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (session_id, question_id)
);

-- Indexes for common query patterns (foreign keys + lookups)
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_module_prerequisites_module_id ON module_prerequisites(module_id);
CREATE INDEX IF NOT EXISTS idx_module_prerequisites_prerequisite_id ON module_prerequisites(prerequisite_module_id);
CREATE INDEX IF NOT EXISTS idx_submodules_module_id ON submodules(module_id);
CREATE INDEX IF NOT EXISTS idx_activities_submodule_id ON activities(submodule_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_progress_student_id ON student_activity_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_activity_progress_activity_id ON student_activity_progress(activity_id);
CREATE INDEX IF NOT EXISTS idx_student_module_progress_student_id ON student_module_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_module_progress_module_id ON student_module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_activity_questions_activity_id ON activity_questions(activity_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_student_id ON question_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_module_chatbot_questions_module_id ON module_chatbot_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_module_chat_sessions_student_id ON module_chat_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_module_chat_sessions_module_id ON module_chat_sessions(module_id);
CREATE INDEX IF NOT EXISTS idx_module_chat_messages_session_id ON module_chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_module_chat_question_results_session_id ON module_chat_question_results(session_id);
CREATE INDEX IF NOT EXISTS idx_module_chat_question_results_question_id ON module_chat_question_results(question_id);