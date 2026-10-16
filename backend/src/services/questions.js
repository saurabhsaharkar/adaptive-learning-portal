import supabase from "../config/supabase.js";

// GET all questions for a test activity
export async function getQuestionsByActivity(activityId) {
  const { data, error } = await supabase
    .from("questions")
    .select("id, activity_id, question_data, position")
    .eq("activity_id", activityId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one question
export async function getQuestionById(questionId) {
  const { data, error } = await supabase
    .from("questions")
    .select("id, activity_id, question_data, position")
    .eq("id", questionId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Question not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// CREATE a question
export async function createQuestion(questionData) {
  const { activity_id, question_data, position = 0 } = questionData;

  if (!activity_id) {
    const err = new Error("activity_id is required");
    err.status = 400;
    throw err;
  }

  if (
    !question_data ||
    typeof question_data !== "object" ||
    Array.isArray(question_data)
  ) {
    const err = new Error("question_data must be a JSON object");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position)) {
    const err = new Error("position must be an integer");
    err.status = 400;
    throw err;
  }

  // Ensure the question belongs to a test activity.
  const { data: activity, error: activityError } = await supabase
    .from("activities")
    .select("id, type")
    .eq("id", activity_id)
    .maybeSingle();

  if (activityError) throw activityError;

  if (!activity) {
    const err = new Error("Activity not found");
    err.status = 404;
    throw err;
  }

  if (activity.type !== "test") {
    const err = new Error("Questions can only be added to test activities");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("questions")
    .insert({
      activity_id,
      question_data,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE a question
export async function updateQuestion(questionId, updates) {
  const allowedFields = ["question_data", "position"];
  const cleanUpdates = {};

  for (const field of allowedFields) {
    if (Object.hasOwn(updates, field)) {
      cleanUpdates[field] = updates[field];
    }
  }

  if (Object.keys(cleanUpdates).length === 0) {
    const err = new Error("No valid fields provided for update");
    err.status = 400;
    throw err;
  }

  if (Object.hasOwn(cleanUpdates, "question_data")) {
    const value = cleanUpdates.question_data;

    if (!value || typeof value !== "object" || Array.isArray(value)) {
      const err = new Error("question_data must be a JSON object");
      err.status = 400;
      throw err;
    }
  }

  if (
    Object.hasOwn(cleanUpdates, "position") &&
    !Number.isInteger(cleanUpdates.position)
  ) {
    const err = new Error("position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("questions")
    .update(cleanUpdates)
    .eq("id", questionId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Question not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE a question
export async function deleteQuestion(questionId) {
  const { data, error } = await supabase
    .from("questions")
    .delete()
    .eq("id", questionId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Question not found");
    err.status = 404;
    throw err;
  }

  return { message: "Question deleted successfully" };
}
