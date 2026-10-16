import supabase from "../config/supabase.js";

// GET all activities
export async function getAllActivities() {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getActivitiesByModule(moduleId) {
  if (!moduleId) {
    const err = new Error("moduleId is required");
    err.status = 400;
    throw err;
  }

  // Step 1: Get all submodules in this module.
  const { data: submodules, error: submoduleError } = await supabase
    .from("submodules")
    .select("id")
    .eq("module_id", moduleId);

  if (submoduleError) throw submoduleError;

  // No submodules means no activities.
  if (!submodules || submodules.length === 0) {
    return [];
  }

  // Step 2: Extract their IDs.
  const submoduleIds = submodules.map((submodule) => submodule.id);

  // Step 3: Get activities belonging to any of those submodules.
  const { data: activities, error: activityError } = await supabase
    .from("activities")
    .select("*")
    .in("submodule_id", submoduleIds)
    .order("position", { ascending: true });

  if (activityError) throw activityError;

  return activities;
}

// GET activities belonging to a submodule
export async function getActivitiesBySubmodule(submoduleId) {
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("submodule_id", submoduleId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one activity, including its blocks
export async function getActivityById(activityId) {
  const { data, error } = await supabase
    .from("activities")
    .select(
      `
      *,
      activity_blocks (
        id,
        activity_id,
        block_type,
        content,
        position
      )
    `,
    )
    .eq("id", activityId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity not found");
    err.status = 404;
    throw err;
  }

  // Keep the blocks in display order.
  data.activity_blocks.sort((a, b) => a.position - b.position);

  return data;
}

// CREATE an activity
export async function createActivity(activityData) {
  const { submodule_id, title, type, position = 0 } = activityData;

  if (!submodule_id || !title || !type) {
    const err = new Error("submodule_id, title, and type are required");
    err.status = 400;
    throw err;
  }

  if (!["learn", "test"].includes(type)) {
    const err = new Error("type must be either 'learn' or 'test'");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position) || position < 0) {
    const err = new Error("position must be a non-negative integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("activities")
    .insert({
      submodule_id,
      title: title.trim(),
      type,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE an activity
export async function updateActivity(activityId, updates) {
  const allowedFields = ["title", "type", "position", "status"];
  const payload = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      payload[field] = updates[field];
    }
  }

  if (Object.keys(payload).length === 0) {
    const err = new Error("No valid fields provided for update");
    err.status = 400;
    throw err;
  }

  if (payload.title !== undefined) {
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      const err = new Error("title must be a non-empty string");
      err.status = 400;
      throw err;
    }

    payload.title = payload.title.trim();
  }

  if (payload.type !== undefined && !["learn", "test"].includes(payload.type)) {
    const err = new Error("type must be either 'learn' or 'test'");
    err.status = 400;
    throw err;
  }

  if (
    payload.position !== undefined &&
    (!Number.isInteger(payload.position) || payload.position < 0)
  ) {
    const err = new Error("position must be a non-negative integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("activities")
    .update(payload)
    .eq("id", activityId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE an activity
export async function deleteActivity(activityId) {
  const { data, error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity not found");
    err.status = 404;
    throw err;
  }

  return { message: "Activity deleted successfully" };
}
