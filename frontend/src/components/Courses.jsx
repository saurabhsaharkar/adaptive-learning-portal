import { useState, useEffect } from "react";
import CourseRoadmap from "./CourseRoadmap";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3500/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCourses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/courses`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load courses");
        }

        if (!cancelled) {
          setCourses(data.courses || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, []);

  if (selectedCourseId) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <button
          type="button"
          onClick={() => setSelectedCourseId(null)}
          className="inline-flex items-center gap-1.5 mb-6 text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          ← Back to courses
        </button>
        <CourseRoadmap
          courseId={selectedCourseId}
          initialOpen
          onBack={() => setSelectedCourseId(null)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-10">
      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-12 text-center text-slate-300">
          <p className="text-lg">No courses available.</p>
        </div>
      ) : (
        <>
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            My Courses
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <a
                key={course.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCourseId(course.id);
                }}
                className="group block rounded-3xl border border-blue-400/20 bg-[#101b32] p-8 transition hover:border-blue-400/50 hover:bg-[#15233d]"
              >
                <span className="inline-block mb-3 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  {course.position + 1}
                </span>
                <h3 className="mb-2 text-2xl font-bold text-white group-hover:text-blue-400">
                  {course.title || "Untitled Course"}
                </h3>
                {course.description && (
                  <p className="mb-6 text-sm leading-6 text-slate-400 line-clamp-3">
                    {course.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2">
                  <span className="text-xs font-medium text-blue-400">
                    Open roadmap
                  </span>
                  <span className="text-xs text-slate-500">→</span>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
