import supabase from "../config/supabase.js";

// GET all activity blocks
export async function getAllActivityBlocks() {
  const { data, error } = await supabase
    .from("activity_blocks")
    .select("*")
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET blocks belonging to an activity
export async function getActivityBlocksByActivity(activityId) {
  const { data, error } = await supabase
    .from("activity_blocks")
    .select("*")
    .eq("activity_id", activityId)
    .order("position", { ascending: true });

  if (error) throw error;
  return data;
}

// GET one activity block
export async function getActivityBlockById(blockId) {
  const { data, error } = await supabase
    .from("activity_blocks")
    .select("*")
    .eq("id", blockId)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity block not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// CREATE an activity block
export async function createActivityBlock(blockData) {
  const { activity_id, block_type, content = {}, position = 0 } = blockData;

  if (!activity_id || !block_type) {
    const err = new Error("activity_id and block_type are required");
    err.status = 400;
    throw err;
  }

  if (typeof block_type !== "string" || !block_type.trim()) {
    const err = new Error("block_type must be a non-empty string");
    err.status = 400;
    throw err;
  }

  if (
    content === null ||
    typeof content !== "object" ||
    Array.isArray(content)
  ) {
    const err = new Error("content must be a JSON object");
    err.status = 400;
    throw err;
  }

  if (!Number.isInteger(position) || position < 0) {
    const err = new Error("position must be a non-negative integer");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("activity_blocks")
    .insert({
      activity_id,
      block_type: block_type.trim(),
      content,
      position,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// UPDATE an activity block
export async function updateActivityBlock(blockId, updates) {
  const allowedFields = ["block_type", "content", "position"];
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

  if (payload.block_type !== undefined) {
    if (typeof payload.block_type !== "string" || !payload.block_type.trim()) {
      const err = new Error("block_type must be a non-empty string");
      err.status = 400;
      throw err;
    }

    payload.block_type = payload.block_type.trim();
  }

  if (payload.content !== undefined) {
    if (
      payload.content === null ||
      typeof payload.content !== "object" ||
      Array.isArray(payload.content)
    ) {
      const err = new Error("content must be a JSON object");
      err.status = 400;
      throw err;
    }
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
    .from("activity_blocks")
    .update(payload)
    .eq("id", blockId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity block not found");
    err.status = 404;
    throw err;
  }

  return data;
}

// DELETE an activity block
export async function deleteActivityBlock(blockId) {
  const { data, error } = await supabase
    .from("activity_blocks")
    .delete()
    .eq("id", blockId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Activity block not found");
    err.status = 404;
    throw err;
  }

  return { message: "Activity block deleted successfully" };
}
