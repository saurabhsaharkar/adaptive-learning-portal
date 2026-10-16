import supabase from "../config/supabase.js";

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
    const err = new Error("userId and moduleId are required");
    err.status = 400;
    throw err;
  }

  // Ensure the module has at least one viva question.
  const { data: firstQuestion, error: questionError } = await supabase
    .from("viva_questions")
    .select("id")
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

  const { data, error } = await supabase
    .from("viva_sessions")
    .insert({
      user_id: userId,
      module_id: moduleId,
      current_question_position: 1,
      messages: [],
      status: "in_progress",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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

// ADVANCE after an answer is judged satisfactory
export async function advanceVivaQuestion(sessionId) {
  const session = await getVivaSessionById(sessionId);

  if (session.status !== "in_progress") {
    const err = new Error("This viva session is not in progress");
    err.status = 400;
    throw err;
  }

  // Find the next question based on ordered position.
  const { data: nextQuestion, error: questionError } = await supabase
    .from("viva_questions")
    .select("id, position")
    .eq("module_id", session.module_id)
    .gt("position", session.current_question_position)
    .order("position", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (questionError) throw questionError;

  // No further question: complete the viva.
  if (!nextQuestion) {
    const { data, error } = await supabase
      .from("viva_sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("status", "in_progress")
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const err = new Error("Session could not be completed");
      err.status = 409;
      throw err;
    }

    return data;
  }

  // Move to the next actual position.
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
    const err = new Error("Session progress changed; retry");
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
