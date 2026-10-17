import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3500/api";

const COLORS = {
  blue: {
    border: "border-blue-400/60",
    label: "text-blue-300",
  },
  cyan: {
    border: "border-cyan-400/60",
    label: "text-cyan-300",
  },
  purple: {
    border: "border-purple-400/60",
    label: "text-purple-300",
  },
  green: {
    border: "border-emerald-400/60",
    label: "text-emerald-300",
  },
};

function ModuleNode({ data, selected }) {
  const theme = COLORS[data.color] || COLORS.blue;

  return (
    <div
      className={`min-w-[260px] max-w-[300px] rounded-2xl border ${theme.border} ${
        selected ? "ring-2 ring-blue-400" : ""
      } bg-[#101b32] px-5 py-4 shadow-xl transition hover:bg-[#15233d]`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2 !border-blue-300 !bg-[#0b1220]"
      />

      <p
        className={`mb-2 text-[10px] font-bold uppercase tracking-[0.18em] ${theme.label}`}
      >
        {data.subtitle}
      </p>

      <h3 className="text-sm font-bold text-white">{data.title}</h3>

      <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">
        {data.description || "Explore this learning module."}
      </p>

      <p className="mt-3 text-[11px] text-slate-500">Click to view details</p>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-blue-300 !bg-[#0b1220]"
      />
    </div>
  );
}

const nodeTypes = { module: ModuleNode };

function CourseCard({ onOpen, loading }) {
  return (
    <div className="mx-auto max-w-5xl rounded-3xl border border-blue-400/20 bg-[#101b32] p-8 md:p-10">
      <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
        C++
      </span>

      <h2 className="mt-5 text-3xl font-bold text-white md:text-4xl">
        Object-Oriented Programming
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
        Explore your course modules and follow the learning path.
      </p>

      <button
        type="button"
        onClick={onOpen}
        disabled={loading}
        className="mt-8 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-60"
      >
        {loading ? "Loading modules..." : "Open Concept Roadmap →"}
      </button>
    </div>
  );
}

function ModuleDetails({ module, onClose, activities, activitiesLoading, activitiesError, onRetryActivities, onSelectActivity }) {
  if (!module) return null;

  const learnActivities = activities.filter((activity) => String(activity.type).toLowerCase() === "learn");
  const testActivities = activities.filter((activity) => String(activity.type).toLowerCase() === "test");
  const otherActivities = activities.filter((activity) => !["learn", "test"].includes(String(activity.type).toLowerCase()));

  const renderActivity = (activity) => (
    <button
  key={activity.id}
  type="button"
  onClick={() => onSelectActivity(activity)}
  className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-blue-400/40 hover:bg-blue-400/5"
>
  <span className="min-w-0">
    <span className="block text-sm font-medium text-slate-100">
      {activity.title || "Untitled activity"}
    </span>
    <span className="mt-1 block text-xs capitalize text-slate-500">
      Status: {(activity.status || "not_started").replaceAll("_", " ")}
    </span>
  </span>
  <span className="shrink-0 text-xs font-semibold text-blue-300">
    Open →
  </span>
</button>
  );

  return (
    <aside className="absolute right-4 top-4 z-10 max-h-[calc(100%-32px)] w-[min(360px,calc(100%-32px))] overflow-y-auto rounded-2xl border border-white/10 bg-[#101b32] p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Course module
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">{module.title}</h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close module details"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:bg-white/10"
        >
          ✕
        </button>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-400">
        {module.description || "No description is available for this module."}
      </p>

      <p className="mt-4 text-xs text-slate-500">
        Level {module.position ?? "—"}
      </p>

      <div className="mt-6 border-t border-white/10 pt-5">
        <h4 className="text-sm font-semibold text-white">Learning activities</h4>
        {activitiesLoading ? (
          <p className="mt-3 text-sm text-slate-400">Loading activities...</p>
        ) : activitiesError ? (
          <div className="mt-3">
            <p role="alert" className="text-sm text-red-300">{activitiesError}</p>
            <button type="button" onClick={onRetryActivities} className="mt-2 text-sm font-semibold text-blue-300 hover:text-blue-200">Try again</button>
          </div>
        ) : activities.length === 0 ? (
          <p className="mt-3 text-sm text-slate-400">No activities found for this module.</p>
        ) : (
          <div className="mt-4 space-y-5">
            {learnActivities.length > 0 && <section><p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-300">Learn</p><div className="space-y-2">{learnActivities.map(renderActivity)}</div></section>}
            {testActivities.length > 0 && <section><p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">Test</p><div className="space-y-2">{testActivities.map(renderActivity)}</div></section>}
            {otherActivities.length > 0 && <section><p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-300">Other</p><div className="space-y-2">{otherActivities.map(renderActivity)}</div></section>}
          </div>
        )}
      </div>
    </aside>
  );
}

export default function CourseRoadmap({
  courseId,
  initialOpen = false,
  onBack,
}) {
  const [roadmapOpen, setRoadmapOpen] = useState(initialOpen);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");
  const [activitiesReloadKey, setActivitiesReloadKey] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [prereqs, setPrereqs] = useState(new Map());

  useEffect(() => {
    setRoadmapOpen(initialOpen);
  }, [initialOpen]);

  useEffect(() => {
    if (!roadmapOpen || !courseId) return;

    const controller = new AbortController();

    async function loadModules() {
      try {
        setLoading(true);
        setError("");

        // This endpoint is expected to return the modules belonging to courseId.
        const response = await fetch(
          `${API_BASE_URL}/modules/course/${encodeURIComponent(courseId)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch modules (HTTP ${response.status})`);
        }

        const result = await response.json();

        // Supports a direct array, { modules: [...] }, or { data: [...] }.
        const fetchedModules = Array.isArray(result)
          ? result
          : Array.isArray(result.modules)
            ? result.modules
            : Array.isArray(result.data)
              ? result.data
              : [];

        setModules(
          [...fetchedModules].sort(
            (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)
          )
        );

        // Load prerequisites for every module in parallel so the graph
        // can be built from real database relationships.
        const moduleIds = fetchedModules.map((m) => String(m.id));
        try {
          const results = await Promise.allSettled(
            moduleIds.map((moduleId) =>
              fetch(
                `${API_BASE_URL}/module-prerequisites/module/${encodeURIComponent(moduleId)}`,
                { signal: controller.signal }
              ).then((r) => (r.ok ? r.json() : { prerequisites: [] }))
            )
          );

          const prereqMap = new Map();
          for (const [i, result] of results.entries()) {
            if (result.status === "fulfilled" && Array.isArray(result.value.prerequisites)) {
              prereqMap.set(
                moduleIds[i],
                result.value.prerequisites.map((p) =>
                  String(p.prerequisite_module_id ?? p.prerequisite?.id)
                )
              );
            } else {
              prereqMap.set(moduleIds[i], []);
            }
          }
          setPrereqs(prereqMap);
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Prerequisite loading error:", err);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load modules.");
          console.error("Module loading error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadModules();

    return () => controller.abort();
  }, [courseId, roadmapOpen, reloadKey]);

  useEffect(() => {
    if (!selectedModuleId) {
      setActivities([]);
      setActivitiesError("");
      setActivitiesLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadActivities() {
      try {
        setActivitiesLoading(true);
        setActivitiesError("");
        setActivities([]);

        const response = await fetch(
          `${API_BASE_URL}/activities/module/${encodeURIComponent(selectedModuleId)}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch activities (HTTP ${response.status})`);
        }

        const result = await response.json();
        const list = Array.isArray(result)
          ? result
          : Array.isArray(result.activities)
            ? result.activities
            : Array.isArray(result.data)
              ? result.data
              : [];

        if (!controller.signal.aborted) {
          setActivities([...list].sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)));
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setActivitiesError(err.message || "Unable to load activities.");
          console.error("Activity loading error:", err);
        }
      } finally {
        if (!controller.signal.aborted) setActivitiesLoading(false);
      }
    }

    void loadActivities();
    return () => controller.abort();
  }, [selectedModuleId, activitiesReloadKey]);

  const orderedModules = useMemo(
    () =>
      [...modules].sort(
        (a, b) => Number(a.position ?? 0) - Number(b.position ?? 0)
      ),
    [modules]
  );

  // Build level-based positions from real prerequisite relationships.
  const moduleIdSet = useMemo(
    () => new Set(orderedModules.map((m) => String(m.id))),
    [orderedModules]
  );

  const nodes = useMemo(() => {
    if (orderedModules.length === 0) return [];

    // Depth of each node = longest path from any root (no prerequisites).
    const depthCache = new Map();

    function getDepth(moduleId) {
      if (depthCache.has(moduleId)) return depthCache.get(moduleId);

      const directPrereqs = (prereqs.get(moduleId) ?? []).filter((pid) =>
        moduleIdSet.has(pid)
      );

      let depth = 0;
      for (const pid of directPrereqs) {
        depth = Math.max(depth, getDepth(pid) + 1);
      }

      depthCache.set(moduleId, depth);
      return depth;
    }

    // Group modules by depth level.
    const byLevel = new Map();
    for (const module of orderedModules) {
      const level = getDepth(String(module.id));
      const group = byLevel.get(level) ?? [];
      group.push(module);
      byLevel.set(level, group);
    }

    const result = [];

    const HORIZONTAL_SPACING = 300;
    const VERTICAL_SPACING = 260;

    // Sort levels numerically so the graph renders top-to-bottom in order.
    const sortedLevels = [...byLevel.keys()].sort((a, b) => a - b);

    for (const level of sortedLevels) {
      const group = byLevel.get(level);
      const n = group.length;

      // Center this level's siblings horizontally around x=0.
      const xOffset = -((n - 1) * HORIZONTAL_SPACING) / 2;

      group.forEach((module, idx) => {
        result.push({
          id: String(module.id),
          type: "module",
          position: {
            x: xOffset + idx * HORIZONTAL_SPACING,
            y: level * VERTICAL_SPACING,
          },
          data: {
            title: module.title,
            description: module.description,
            subtitle: `Level ${level + 1}`,
            color: ["blue", "cyan", "purple", "green"][level % 4],
          },
        });
      });
    }

    return result;
  }, [orderedModules, prereqs, moduleIdSet]);

  const edges = useMemo(() => {
    const result = [];
    const seen = new Set();

    for (const module of orderedModules) {
      const moduleId = String(module.id);
      const directPrereqs = (prereqs.get(moduleId) ?? []).filter((pid) =>
        moduleIdSet.has(pid)
      );

      for (const prereqId of directPrereqs) {
        const edgeId = `edge-${prereqId}-${moduleId}`;
        if (seen.has(edgeId)) continue;
        seen.add(edgeId);

        result.push({
          id: edgeId,
          source: prereqId,
          target: moduleId,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#3b82f6",
          },
          style: { stroke: "#3b82f6", strokeWidth: 1.5 },
        });
      }
    }

    return result;
  }, [orderedModules, prereqs, moduleIdSet]);

  const selectedModule = orderedModules.find(
    (module) => String(module.id) === String(selectedModuleId)
  );

  const openRoadmap = useCallback(() => {
    setRoadmapOpen(true);
  }, []);

  if (!roadmapOpen) {
    return (
      <main className="min-h-[75vh] bg-[#0b1220] px-4 py-8 text-white md:px-8">
        <div className="mx-auto mb-8 max-w-5xl">
          <button
            type="button"
            onClick={onBack || (() => window.history.back())}
            className="mb-6 text-sm text-slate-400 hover:text-white"
          >
            ← Back
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            Your learning path
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            Choose a course
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Open the course to load its modules from the database.
          </p>
        </div>

        <CourseCard onOpen={openRoadmap} loading={loading} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b1220] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() => {
            setRoadmapOpen(false);
            setSelectedModuleId(null);
            if (onBack) onBack();
          }}
          className="mb-5 text-sm text-slate-400 hover:text-white"
        >
          ← Back to Courses
        </button>

        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            C++ LEARNING ROADMAP
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Object-Oriented Programming
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Modules are fetched from your activities API and arranged level by
            level. Select a node to view its details.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 p-8 text-slate-300">
            Loading course modules...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-300"
          >
            <p className="font-semibold">Could not load modules</p>
            <p className="mt-2 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 rounded-lg bg-red-400/10 px-4 py-2 text-sm hover:bg-red-400/20"
            >
              Try again
            </button>
          </div>
        ) : !courseId ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-6 text-amber-200">
            No course ID was provided. Pass a valid course ID to CourseRoadmap.
          </div>
        ) : orderedModules.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-8 text-slate-300">
            No modules were returned for this course.
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs text-slate-400">
              {orderedModules.length} modules · Scroll to zoom · Drag to navigate
            </p>

            <div className="relative h-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#0e1729]">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={(_, node) => {
                  setSelectedModuleId(String(node.id));
                  setSelectedActivity(null);
                }}
                onPaneClick={() => {
                  setSelectedModuleId(null);
                  setSelectedActivity(null);
                }}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.2}
                maxZoom={1.5}
                nodesDraggable={false}
                nodesConnectable={false}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="#263650" gap={24} size={1} />
                <Controls showInteractive={false} />
              </ReactFlow>

              <ModuleDetails
                module={selectedModule}
                onClose={() => {
                  setSelectedModuleId(null);
                  setSelectedActivity(null);
                }}
                activities={activities}
                activitiesLoading={activitiesLoading}
                activitiesError={activitiesError}
                onRetryActivities={() => setActivitiesReloadKey((key) => key + 1)}
                onSelectActivity={setSelectedActivity}
              />

              {selectedActivity && (
                <div className="absolute bottom-4 left-4 z-20 w-[min(360px,calc(100%-32px))] rounded-2xl border border-blue-400/30 bg-[#101b32] p-5 shadow-2xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-300">{selectedActivity.type || "Activity"}</p>
                      <h3 className="mt-2 text-lg font-bold text-white">{selectedActivity.title}</h3>
                    </div>
                    <button type="button" onClick={() => setSelectedActivity(null)} aria-label="Close activity details" className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 hover:bg-white/10">✕</button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-400">This activity is loaded from your database. The next step is to connect its learning content or test questions.</p>
                  <p className="mt-3 text-xs text-slate-500">Status: {(selectedActivity.status || "not_started").replaceAll("_", " ")}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
