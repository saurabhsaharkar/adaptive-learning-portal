
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3500/api";

export async function fetchActivitiesByModule(moduleId) {
  const response = await fetch(
    `${API_BASE_URL}/activities/module/${encodeURIComponent(moduleId)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch activities: HTTP ${response.status}`);
  }

  const data = await response.json();

  // Adjust this to match your backend response shape.
  return Array.isArray(data) ? data : data.activities ?? [];
}
