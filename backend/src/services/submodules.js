import supabase from "../config/supabase.js";

// GET all submodules
export async function getAllSubmodules() {
  const { data, error } = await supabase
    .from("submodules")
    .select(
      `
      id,
      module_id,
      title,
      description,
      position,
      created_at
    `,
    )
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET submodules belonging to a module
export async function getSubmodulesByModule(moduleId) {
  const { data, error } = await supabase
    .from("submodules")
    .select(
      `
      id,
      module_id,
      title,
      description,
      position,
      created_at
    `,
    )
    .eq("module_id", moduleId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one submodule
export async function getSubmoduleById(submoduleId) {
  const { data, error } = await supabase
    .from("submodules")
    .select(
      `
      id,
      module_id,
      title,
      description,
      position,
      created_at
    `,
    )
    .eq("id", submoduleId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Submodule not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// CREATE a submodule
export async function createSubmodule(submoduleData) {
  const { module_id, title, description = null, position = 0 } = submoduleData;

  if (typeof module_id !== "string" || !module_id.trim()) {
    const err = new Error("module_id is required");
    err.status = 400;
    throw err;
  }

  if (typeof title !== "string" || !title.trim()) {
    const err = new Error("Submodule title is required");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position)) {
    const err = new Error("position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("submodules")
    .insert({
      module_id,
      title: title.trim(),
      description,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE a submodule
export async function updateSubmodule(submoduleId, updates) {
  const allowedFields = ["title", "description", "position"];
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

  if (
    Object.hasOwn(cleanUpdates, "title") &&
    (typeof cleanUpdates.title !== "string" || !cleanUpdates.title.trim())
  ) {
    const err = new Error("Submodule title cannot be empty");
    err.status = 400;
    throw err;
  }

  if (Object.hasOwn(cleanUpdates, "title")) {
    cleanUpdates.title = cleanUpdates.title.trim();
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
    .from("submodules")
    .update(cleanUpdates)
    .eq("id", submoduleId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Submodule not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE a submodule
export async function deleteSubmodule(submoduleId) {
  const { data, error } = await supabase
    .from("submodules")
    .delete()
    .eq("id", submoduleId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Submodule not found");
    err.status = 404;
    throw err;
  }

  return { message: "Submodule deleted successfully" };
}
