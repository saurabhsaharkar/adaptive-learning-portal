import supabase from "../config/supabase.js";

// GET all modules
export async function getAllModules() {
  const { data, error } = await supabase
    .from("modules")
    .select("id, course_id, title, description, position, created_at")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET all modules belonging to a course
export async function getModulesByCourse(courseId) {
  const { data, error } = await supabase
    .from("modules")
    .select("id, course_id, title, description, position, created_at")
    .eq("course_id", courseId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one module, including its submodules
export async function getModuleById(moduleId) {
  const { data, error } = await supabase
    .from("modules")
    .select(
      `
      id,
      course_id,
      title,
      description,
      position,
      created_at,
      submodules (
        id,
        module_id,
        title,
        description,
        position,
        created_at
      )
    `,
    )
    .eq("id", moduleId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Module not found");
    err.status = 404;
    throw err;
  }

  data.submodules.sort((a, b) => a.position - b.position);
  return data;
}

// CREATE a module
export async function createModule(moduleData) {
  const { course_id, title, description = null, position = 0 } = moduleData;

  if (typeof course_id !== "string" || !course_id.trim()) {
    const err = new Error("course_id is required");
    err.status = 400;
    throw err;
  }

  if (typeof title !== "string" || !title.trim()) {
    const err = new Error("Module title is required");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position)) {
    const err = new Error("position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("modules")
    .insert({
      course_id,
      title: title.trim(),
      description,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE a module
export async function updateModule(moduleId, updates) {
  const allowedFields = ["title", "description", "position", "status"];
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
    const err = new Error("Module title cannot be empty");
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
    .from("modules")
    .update(cleanUpdates)
    .eq("id", moduleId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Module not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE a module
export async function deleteModule(moduleId) {
  const { data, error } = await supabase
    .from("modules")
    .delete()
    .eq("id", moduleId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Module not found");
    err.status = 404;
    throw err;
  }

  return { message: "Module deleted successfully" };
}
