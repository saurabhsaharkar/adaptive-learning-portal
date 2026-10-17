import supabase from "../config/supabase.js";
import { evaluateVivaAnswer } from "./vivaEvaluator.js";

// SUBMIT and evaluate an answer for the current viva question
export async function submitVivaAnswer(sessionId, answer) {
  if (typeof answer !== "string" || !answer.trim()) {
    const err = new Error("A non-empty answer is required");
    err.status = 400;
    throw err;
  }

  if (answer.length > 5000) {
    const err = new Error("Answer must not exceed 5000 characters");
    err.status = 400;
    throw err;
  }

  const session = await getVivaSessionById(sessionId);

  if (session.status !== "in_progress") {
    const err = new Error("This viva session is not in progress");
    err.status = 409;
    throw err;
  }

  // Fetch the current question and its private rubric from the database.
  const { data: question, error: questionError } = await supabase
    .from("viva_questions")
    .select("id, question, evaluation_criteria, position")
    .eq("module_id", session.module_id)
    .eq("position", session.current_question_position)
    .maybeSingle();

  if (questionError) throw questionError;

  if (!question) {
    const err = new Error("Current viva question not found");
    err.status = 404;
    throw err;
  }

  // Evaluate using server-controlled question and criteria.
  const aiResult = await evaluateVivaAnswer({
    question: question.question,
    evaluationCriteria: question.evaluation_criteria,
    answer: answer.trim(),
  });

  // Enforce the passing threshold in our backend.
  // Gemini recommends; our application decides.
  const canAdvance = aiResult.score >= 7 && aiResult.should_advance;

  const timestamp = new Date().toISOString();
  const messages = Array.isArray(session.messages) ? session.messages : [];

  const answerMessage = {
    role: "user",
    type: "answer",
    question_id: question.id,
    question_position: question.position,
    content: answer.trim(),
    created_at: timestamp,
  };

  const evaluationMessage = {
    role: "assistant",
    type: "evaluation",
    question_id: question.id,
    question_position: question.position,
    score: aiResult.score,
    max_score: 10,
    feedback: aiResult.feedback,
    strengths: aiResult.strengths,
    improvements: aiResult.improvements,
    should_advance: canAdvance,
    created_at: timestamp,
  };

  const updatedMessages = [...messages, answerMessage, evaluationMessage];

  const { data: updatedSession, error: updateError } = await supabase
    .from("viva_sessions")
    .update({ messages: updatedMessages })
    .eq("id", sessionId)
    .eq("status", "in_progress")
    .eq("current_question_position", session.current_question_position)
    .select()
    .maybeSingle();

  if (updateError) throw updateError;

  if (!updatedSession) {
    const err = new Error(
      "The session changed while the answer was being evaluated. Reload it before retrying.",
    );
    err.status = 409;
    throw err;
  }

  return {
    session: updatedSession,
    current_question: {
      id: question.id,
      question: question.question,
      position: question.position,
    },
    evaluation: {
      score: aiResult.score,
      max_score: 10,
      feedback: aiResult.feedback,
      strengths: aiResult.strengths,
      improvements: aiResult.improvements,
      should_advance: canAdvance,
    },
  };
}

export async function getCurrentVivaQuestion(moduleId, position) {
  const { data, error } = await supabase
    .from("viva_questions")
    .select("id, question, position")
    .eq("module_id", moduleId)
    .eq("position", position)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Current viva question not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// GET sessions for a user
export async function getVivaSessionsByUser(userId) {
  const { data, error } = await supabase
    .from("viva_sessions")
    .select(
      `
      id,
      user_id,
      module_id,
      current_question_position,
      messages,
      status,
      started_at,
      ended_at
    `,
    )
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

// GET one session
export async function getVivaSessionById(sessionId) {
  const { data, error } = await supabase
    .from("viva_sessions")
    .select("*")
    .eq("id", sessionId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Viva session not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// START a new viva session
export async function createVivaSession(userId, moduleId) {
  if (!userId || !moduleId) {
    const err = new Error("user_id and module_id are required");
    err.status = 400;
    throw err;
  }

  // Find the first question in the module.
  const { data: firstQuestion, error: questionError } = await supabase
    .from("viva_questions")
    .select("id, question, position")
    .eq("module_id", moduleId)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (questionError) throw questionError;

  if (!firstQuestion) {
    const err = new Error("This module does not have any viva questions");
    err.status = 400;
    throw err;
  }

  // The session schema requires the current position to be >= 1.
  if (firstQuestion.position < 1) {
    const err = new Error("Viva question positions must start at 1 or greater");
    err.status = 500;
    throw err;
  }

  // Create the session at the first question's actual position.
  const { data: session, error: sessionError } = await supabase
    .from("viva_sessions")
    .insert({
      user_id: userId,
      module_id: moduleId,
      current_question_position: firstQuestion.position,
      messages: [],
      status: "in_progress",
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  return {
    session,
    current_question: firstQuestion,
  };
}

// APPEND a message to the conversation
export async function appendVivaMessage(sessionId, message) {
  if (
    !message ||
    typeof message !== "object" ||
    Array.isArray(message) ||
    typeof message.role !== "string" ||
    typeof message.content !== "string"
  ) {
    const err = new Error("message must contain a role and string content");
    err.status = 400;
    throw err;
  }

  // Fetch the current session.
  const session = await getVivaSessionById(sessionId);

  if (session.status !== "in_progress") {
    const err = new Error("This viva session is not in progress");
    err.status = 400;
    throw err;
  }

  const messages = Array.isArray(session.messages) ? session.messages : [];

  const updatedMessages = [...messages, message];

  const { data, error } = await supabase
    .from("viva_sessions")
    .update({ messages: updatedMessages })
    .eq("id", sessionId)
    .eq("status", "in_progress")
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Session was changed or is no longer in progress");
    err.status = 409;
    throw err;
  }

  return data;
}

export async function advanceVivaQuestion(sessionId) {
  const session = await getVivaSessionById(sessionId);

  if (session.status !== "in_progress") {
    const err = new Error("This viva session is not in progress");
    err.status = 400;
    throw err;
  }

  // Check whether the current question has a passing evaluation.
  const messages = Array.isArray(session.messages) ? session.messages : [];

  const latestEvaluation = [...messages]
    .reverse()
    .find(
      (message) =>
        message.type === "evaluation" &&
        message.question_position === session.current_question_position,
    );

  if (!latestEvaluation || latestEvaluation.should_advance !== true) {
    const err = new Error(
      "Submit an answer that meets the passing criteria before advancing",
    );
    err.status = 409;
    throw err;
  }

  // Find the next question based on its actual position.
  const { data: nextQuestion, error: questionError } = await supabase
    .from("viva_questions")
    .select("id, position")
    .eq("module_id", session.module_id)
    .gt("position", session.current_question_position)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (questionError) throw questionError;

  // No remaining questions: complete the viva.
  if (!nextQuestion) {
    const { data, error } = await supabase
      .from("viva_sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("status", "in_progress")
      .eq("current_question_position", session.current_question_position)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error(
        "Session progress changed; reload the session and retry",
      );
      err.status = 409;
      throw err;
    }

    return data;
  }

  // Move to the next question only if the session hasn't changed.
  const { data, error } = await supabase
    .from("viva_sessions")
    .update({
      current_question_position: nextQuestion.position,
    })
    .eq("id", sessionId)
    .eq("status", "in_progress")
    .eq("current_question_position", session.current_question_position)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error(
      "Session progress changed; reload the session and retry",
    );
    err.status = 409;
    throw err;
  }

  return data;
}
// ABANDON a session
export async function abandonVivaSession(sessionId) {
  const { data, error } = await supabase
    .from("viva_sessions")
    .update({
      status: "abandoned",
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("status", "in_progress")
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Session not found or is no longer in progress");
    err.status = 404;
    throw err;
  }

  return data;
}
