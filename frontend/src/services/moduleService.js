
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function fetchModulesByCourse(courseId) {
  const response = await fetch(
    `${API_BASE_URL}/modules/course/${encodeURIComponent(courseId)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch modules: ${response.status}`);
  }

  const data = await response.json();
  return data.modules ?? [];
}
