import supabase from "../config/supabase.js";

// GET prerequisites for a module
export async function getModulePrerequisites(moduleId) {
  const { data, error } = await supabase
    .from("module_prerequisites")
    .select(
      `
      module_id,
      prerequisite_module_id,
      prerequisite:modules!module_prerequisites_prerequisite_module_id_fkey (
        id,
        title,
        description,
        course_id,
        position
      )
    `,
    )
    .eq("module_id", moduleId);

  if (error) throw error;
  return data;
}

// GET modules that depend on a given module
export async function getDependentModules(moduleId) {
  const { data, error } = await supabase
    .from("module_prerequisites")
    .select(
      `
      module_id,
      prerequisite_module_id,
      module:modules!module_prerequisites_module_id_fkey (
        id,
        title,
        description,
        course_id,
        position
      )
    `,
    )
    .eq("prerequisite_module_id", moduleId);

  if (error) throw error;
  return data;
}

// ADD a prerequisite relationship
export async function addModulePrerequisite(moduleId, prerequisiteModuleId) {
  if (!moduleId || !prerequisiteModuleId) {
    const err = new Error("module_id and prerequisite_module_id are required");
    err.status = 400;
    throw err;
  }

  if (moduleId === prerequisiteModuleId) {
    const err = new Error("A module cannot be its own prerequisite");
    err.status = 400;
    throw err;
  }

  // Confirm both modules exist and retrieve their course IDs.
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("id, course_id")
    .in("id", [moduleId, prerequisiteModuleId]);

  if (modulesError) throw modulesError;

  if (!modules || modules.length !== 2) {
    const err = new Error("Both the module and prerequisite module must exist");
    err.status = 404;
    throw err;
  }

  const module = modules.find((item) => item.id === moduleId);
  const prerequisite = modules.find((item) => item.id === prerequisiteModuleId);

  // Keep prerequisite relationships within the same course.
  if (module.course_id !== prerequisite.course_id) {
    const err = new Error(
      "A prerequisite and its module must belong to the same course",
    );
    err.status = 400;
    throw err;
  }

  // Check whether adding this relationship creates a cycle.
  // If A requires B, B must not already depend on A.
  const { data: existing, error: existingError } = await supabase
    .from("module_prerequisites")
    .select("module_id, prerequisite_module_id");

  if (existingError) throw existingError;

  const graph = new Map();

  for (const relation of existing ?? []) {
    const dependencies = graph.get(relation.module_id) ?? [];
    dependencies.push(relation.prerequisite_module_id);
    graph.set(relation.module_id, dependencies);
  }

  // Adding moduleId -> prerequisiteModuleId is invalid if
  // prerequisiteModuleId already depends (directly or indirectly)
  // on moduleId.
  const stack = [prerequisiteModuleId];
  const visited = new Set();

  while (stack.length > 0) {
    const current = stack.pop();

    if (current === moduleId) {
      const err = new Error(
        "This prerequisite would create a circular dependency",
      );
      err.status = 400;
      throw err;
    }

    if (visited.has(current)) continue;
    visited.add(current);

    for (const dependency of graph.get(current) ?? []) {
      stack.push(dependency);
    }
  }

  const { data, error } = await supabase
    .from("module_prerequisites")
    .insert({
      module_id: moduleId,
      prerequisite_module_id: prerequisiteModuleId,
    })
    .select()
    .single();

  if (error) {
    // PostgreSQL unique violation: relationship already exists.
    if (error.code === "23505") {
      const err = new Error("This prerequisite already exists");
      err.status = 409;
      throw err;
    }

    throw error;
  }

  return data;
}

// REMOVE a prerequisite relationship
export async function removeModulePrerequisite(moduleId, prerequisiteModuleId) {
  if (!moduleId || !prerequisiteModuleId) {
    const err = new Error("module_id and prerequisite_module_id are required");
    err.status = 400;
    throw err;
  }

  const { data, error } = await supabase
    .from("module_prerequisites")
    .delete()
    .eq("module_id", moduleId)
    .eq("prerequisite_module_id", prerequisiteModuleId)
    .select()
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const err = new Error("Prerequisite relationship not found");
    err.status = 404;
    throw err;
  }

  return {
    message: "Prerequisite removed successfully",
    relationship: data,
  };
}
