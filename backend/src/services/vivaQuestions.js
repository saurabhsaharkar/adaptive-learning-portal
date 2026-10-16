import supabase from "../config/supabase.js";

// GET all viva questions for a module
export async function getVivaQuestionsByModule(moduleId) {
  const { data, error } = await supabase
    .from("viva_questions")
    .select("id, module_id, question, evaluation_criteria, position")
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one viva question
export async function getVivaQuestionById(questionId) {
  const { data, error } = await supabase
    .from("viva_questions")
    .select("id, module_id, question, evaluation_criteria, position")
    .eq("id", questionId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Viva question not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// CREATE a viva question
export async function createVivaQuestion(questionData) {
  const {
    module_id,
    question,
    evaluation_criteria,
    position = 0,
  } = questionData;

  if (!module_id) {
    const err = new Error("module_id is required");
    err.status = 400;
    throw err;
  }

  if (typeof question !== "string" || !question.trim()) {
    const err = new Error("Question text is required");
    err.status = 400;
    throw err;
  }

  if (typeof evaluation_criteria !== "string" || !evaluation_criteria.trim()) {
    const err = new Error("evaluation_criteria is required");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position)) {
    const err = new Error("position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("viva_questions")
    .insert({
      module_id,
      question: question.trim(),
      evaluation_criteria: evaluation_criteria.trim(),
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE a viva question
export async function updateVivaQuestion(questionId, updates) {
  const allowedFields = ["question", "evaluation_criteria", "position"];

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

  for (const field of ["question", "evaluation_criteria"]) {
    if (
      Object.hasOwn(cleanUpdates, field) &&
      (typeof cleanUpdates[field] !== "string" || !cleanUpdates[field].trim())
    ) {
      const err = new Error(`${field} cannot be empty`);
      err.status = 400;
      throw err;
    }

    if (Object.hasOwn(cleanUpdates, field)) {
      cleanUpdates[field] = cleanUpdates[field].trim();
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
    .from("viva_questions")
    .update(cleanUpdates)
    .eq("id", questionId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Viva question not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE a viva question
export async function deleteVivaQuestion(questionId) {
  const { data, error } = await supabase
    .from("viva_questions")
    .delete()
    .eq("id", questionId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Viva question not found");
    err.status = 404;
    throw err;
  }

  return { message: "Viva question deleted successfully" };
}
