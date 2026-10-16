import supabase from "../config/supabase.js";

// GET all courses
export async function getAllCourses() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, description, position, created_at")
    .order("position", { ascending: true });

  if (error) throw error;

  return data;
}

// GET one course, including its modules
export async function getCourseById(courseId) {
  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      id,
      title,
      description,
      position,
      created_at,
      modules (
        id,
        title,
        description,
        position,
        created_at
      )
    `,
    )
    .eq("id", courseId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Course not found");
    err.status = 404;
    throw err;
  }

  // Ensure modules are ordered by position.
  data.modules.sort((a, b) => a.position - b.position);

  return data;
}

// CREATE a course
export async function createCourse(courseData) {
  const { title, description = null, position = 0 } = courseData;

  if (typeof title !== "string" || !title.trim()) {
    const err = new Error("Course title is required");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position)) {
    const err = new Error("Position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title: title.trim(),
      description,
      position,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// UPDATE a course
export async function updateCourse(courseId, updates) {
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
    const err = new Error("Course title cannot be empty");
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
    const err = new Error("Position must be an integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("courses")
    .update(cleanUpdates)
    .eq("id", courseId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Course not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE a course
export async function deleteCourse(courseId) {
  const { data, error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Course not found");
    err.status = 404;
    throw err;
  }

  return { message: "Course deleted successfully" };
}
