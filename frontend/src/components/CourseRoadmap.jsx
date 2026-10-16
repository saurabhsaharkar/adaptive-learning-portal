import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import LearningActivity from "./LearningActivity";

// --------------------------------------------------
// OOP CONCEPT DATA
// --------------------------------------------------

const conceptNodes = [
  {
    id: "fundamentals",
    position: { x: 420, y: 20 },
    data: {
      title: "OOP Fundamentals",
      subtitle: "Start Here",
      color: "blue",
      overview:
        "Understand the basic principles of Object-Oriented Programming and how Java represents real-world entities.",
      subtopics: [
        "What is Object-Oriented Programming?",
        "Classes and Objects",
        "State and Behaviour",
        "Advantages of OOP",
      ],
      prerequisites: ["Basic Java syntax"],
      next: ["Classes & Objects", "Methods"],
    },
  },
  {
    id: "classes",
    position: { x: 140, y: 170 },
    data: {
      title: "Classes & Objects",
      subtitle: "Core Concept",
      color: "cyan",
      overview:
        "Learn how classes act as blueprints and how objects represent individual instances of those classes.",
      subtopics: [
        "Defining a class",
        "Creating objects",
        "Instance variables",
        "Object references",
      ],
      prerequisites: ["OOP Fundamentals"],
      next: ["Constructors", "Encapsulation"],
    },
  },
  {
    id: "methods",
    position: { x: 700, y: 170 },
    data: {
      title: "Methods",
      subtitle: "Core Concept",
      color: "cyan",
      overview:
        "Methods define the operations an object can perform. Learn how to declare, call, and use methods in Java.",
      subtopics: [
        "Method declaration",
        "Parameters and return values",
        "Method calling",
        "Method overloading",
      ],
      prerequisites: ["OOP Fundamentals"],
      next: ["Method Overloading", "Access Modifiers"],
    },
  },
  {
    id: "constructors",
    position: { x: 20, y: 340 },
    data: {
      title: "Constructors",
      subtitle: "Object Creation",
      color: "purple",
      overview:
        "Constructors initialize new objects and help establish their initial state.",
      subtopics: [
        "Default constructors",
        "Parameterized constructors",
        "Constructor overloading",
        "Constructor chaining",
      ],
      prerequisites: ["Classes & Objects"],
      next: ["Inheritance"],
    },
  },
  {
    id: "encapsulation",
    position: { x: 260, y: 340 },
    data: {
      title: "Encapsulation",
      subtitle: "Data Protection",
      color: "purple",
      overview:
        "Encapsulation combines data and methods while controlling access to an object's internal state.",
      subtopics: [
        "Data hiding",
        "Private fields",
        "Getters and setters",
        "Access control",
      ],
      prerequisites: ["Classes & Objects"],
      next: ["Inheritance"],
    },
  },
  {
    id: "overloading",
    position: { x: 560, y: 340 },
    data: {
      title: "Method Overloading",
      subtitle: "Compile-Time",
      color: "purple",
      overview:
        "Method overloading allows multiple methods to share a name while having different parameter lists.",
      subtopics: [
        "Different parameter counts",
        "Different parameter types",
        "Compile-time polymorphism",
        "Overloading examples",
      ],
      prerequisites: ["Methods"],
      next: ["Inheritance"],
    },
  },
  {
    id: "access",
    position: { x: 800, y: 340 },
    data: {
      title: "Access Modifiers",
      subtitle: "Visibility",
      color: "purple",
      overview:
        "Access modifiers control where classes, methods, and variables can be accessed.",
      subtopics: [
        "public",
        "private",
        "protected",
        "Default access",
      ],
      prerequisites: ["Classes & Objects", "Methods"],
      next: ["Inheritance"],
    },
  },
  {
    id: "inheritance",
    position: { x: 420, y: 510 },
    data: {
      title: "Inheritance",
      subtitle: "Reusability",
      color: "blue",
      overview:
        "Inheritance allows a class to acquire accessible members from another class, supporting code reuse and class hierarchies.",
      subtopics: [
        "Parent and child classes",
        "extends keyword",
        "Types of inheritance",
        "super keyword",
      ],
      prerequisites: [
        "Classes & Objects",
        "Constructors",
        "Encapsulation",
      ],
      next: ["Method Overriding", "this & super"],
    },
  },
  {
    id: "overriding",
    position: { x: 220, y: 680 },
    data: {
      title: "Method Overriding",
      subtitle: "Runtime Behaviour",
      color: "purple",
      overview:
        "Method overriding lets a subclass provide its own implementation of an inherited method.",
      subtopics: [
        "Overriding rules",
        "@Override annotation",
        "Runtime method dispatch",
        "Overloading vs overriding",
      ],
      prerequisites: ["Inheritance"],
      next: ["Polymorphism"],
    },
  },
  {
    id: "this-super",
    position: { x: 620, y: 680 },
    data: {
      title: "this & super",
      subtitle: "Java Keywords",
      color: "purple",
      overview:
        "Learn how this refers to the current object and super accesses superclass members or constructors.",
      subtopics: [
        "this keyword",
        "super keyword",
        "Constructor chaining",
        "Calling superclass methods",
      ],
      prerequisites: ["Classes & Objects", "Inheritance"],
      next: ["Polymorphism"],
    },
  },
  {
    id: "polymorphism",
    position: { x: 420, y: 850 },
    data: {
      title: "Polymorphism",
      subtitle: "Many Forms",
      color: "blue",
      overview:
        "Polymorphism allows the same interface or method call to produce different behaviours depending on the object or context.",
      subtopics: [
        "Compile-time polymorphism",
        "Runtime polymorphism",
        "Method overloading",
        "Method overriding",
      ],
      prerequisites: ["Inheritance", "Method Overriding"],
      next: ["Abstraction", "Interfaces"],
    },
  },
  {
    id: "abstraction",
    position: { x: 220, y: 1020 },
    data: {
      title: "Abstraction",
      subtitle: "Hide Complexity",
      color: "purple",
      overview:
        "Abstraction exposes essential functionality while hiding unnecessary implementation details.",
      subtopics: [
        "Abstract classes",
        "Abstract methods",
        "The abstract keyword",
        "When to use abstraction",
      ],
      prerequisites: ["Polymorphism"],
      next: ["Advanced OOP"],
    },
  },
  {
    id: "interface",
    position: { x: 620, y: 1020 },
    data: {
      title: "Interfaces",
      subtitle: "Contracts",
      color: "purple",
      overview:
        "Interfaces define contracts that implementing classes agree to fulfil.",
      subtopics: [
        "Declaring interfaces",
        "implements keyword",
        "Multiple interfaces",
        "Default and static methods",
      ],
      prerequisites: ["Classes & Objects", "Polymorphism"],
      next: ["Advanced OOP"],
    },
  },
  {
    id: "advanced",
    position: { x: 420, y: 1190 },
    data: {
      title: "Advanced OOP",
      subtitle: "Level Up",
      color: "green",
      overview:
        "Bring your OOP knowledge together with more advanced Java concepts and practical design techniques.",
      subtopics: [
        "Composition and aggregation",
        "Association",
        "SOLID principles",
        "Design patterns introduction",
      ],
      prerequisites: ["Abstraction", "Interfaces"],
      next: ["Practice Problems", "Java OOP Projects"],
    },
  },
];

// --------------------------------------------------
// GRAPH CONNECTIONS
// --------------------------------------------------

const conceptEdges = [
  {
    id: "e1",
    source: "fundamentals",
    target: "classes",
  },
  {
    id: "e2",
    source: "fundamentals",
    target: "methods",
  },
  {
    id: "e3",
    source: "classes",
    target: "constructors",
  },
  {
    id: "e4",
    source: "classes",
    target: "encapsulation",
  },
  {
    id: "e5",
    source: "methods",
    target: "overloading",
  },
  {
    id: "e6",
    source: "methods",
    target: "access",
  },
  {
    id: "e7",
    source: "constructors",
    target: "inheritance",
  },
  {
    id: "e8",
    source: "encapsulation",
    target: "inheritance",
  },
  {
    id: "e9",
    source: "overloading",
    target: "inheritance",
  },
  {
    id: "e10",
    source: "access",
    target: "inheritance",
  },
  {
    id: "e11",
    source: "inheritance",
    target: "overriding",
  },
  {
    id: "e12",
    source: "inheritance",
    target: "this-super",
  },
  {
    id: "e13",
    source: "overriding",
    target: "polymorphism",
  },
  {
    id: "e14",
    source: "this-super",
    target: "polymorphism",
  },
  {
    id: "e15",
    source: "polymorphism",
    target: "abstraction",
  },
  {
    id: "e16",
    source: "polymorphism",
    target: "interface",
  },
  {
    id: "e17",
    source: "abstraction",
    target: "advanced",
  },
  {
    id: "e18",
    source: "interface",
    target: "advanced",
  },
].map((edge) => ({
  ...edge,
  type: "smoothstep",
  animated: false,
  style: {
    stroke: "#3b82f6",
    strokeWidth: 1.5,
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#3b82f6",
    width: 16,
    height: 16,
  },
}));

// --------------------------------------------------
// CUSTOM GRAPH NODE
// --------------------------------------------------

function ConceptNode({ data, selected }) {
  const colors = {
    blue: {
      border: "border-blue-400/60",
      glow: "shadow-blue-500/10",
      label: "text-blue-300",
    },
    cyan: {
      border: "border-cyan-400/60",
      glow: "shadow-cyan-500/10",
      label: "text-cyan-300",
    },
    purple: {
      border: "border-purple-400/60",
      glow: "shadow-purple-500/10",
      label: "text-purple-300",
    },
    green: {
      border: "border-emerald-400/60",
      glow: "shadow-emerald-500/10",
      label: "text-emerald-300",
    },
  };

  const theme = colors[data.color] || colors.blue;

  return (
    <div
      className={`
        relative min-w-[205px] rounded-2xl border
        ${theme.border}
        ${theme.glow}
        bg-[#101b32] px-5 py-4
        shadow-xl transition-all duration-200
        ${selected ? "ring-2 ring-blue-400 shadow-blue-500/20" : ""}
        hover:-translate-y-0.5 hover:bg-[#15233d]
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2 !w-2 !border-2 !border-blue-300 !bg-[#0b1220]"
      />

      <div className={`mb-2 text-[10px] font-bold uppercase tracking-[0.18em] ${theme.label}`}>
        {data.subtitle}
      </div>

      <div className="text-sm font-bold text-white">
        {data.title}
      </div>

      <div className="mt-2 text-[11px] text-slate-400">
        Click to explore
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2 !w-2 !border-2 !border-blue-300 !bg-[#0b1220]"
      />
    </div>
  );
}

const nodeTypes = {
  concept: ConceptNode,
};

// --------------------------------------------------
// COURSE CARD
// --------------------------------------------------

function CourseCard({ onOpen }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-[#101b32] p-8 md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
              JAVA
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
              Beginner to Advanced
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Object-Oriented Programming
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Master Java OOP through an interactive concept roadmap.
            Explore topics, understand prerequisites, and open learning
            activities for each concept.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["14", "Concept nodes"],
              ["4", "Core OOP pillars"],
              ["Interactive", "Learning roadmap"],
              ["Java", "Programming language"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
              >
                <div className="text-lg font-bold text-white">
                  {value}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-8 rounded-xl bg-blue-500 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400"
          >
            Open Concept Roadmap →
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// NODE DETAILS PANEL
// --------------------------------------------------

function NodeDetails({ node, onClose, onExplore }) {
  if (!node) return null;

  const { title, subtitle, overview, subtopics, prerequisites, next } =
    node.data;

  return (
    <div className="absolute right-4 top-4 z-20 flex max-h-[calc(100%-32px)] w-[min(360px,calc(100%-32px))] flex-col overflow-y-auto rounded-2xl border border-white/10 bg-[#101b32]/[0.98] p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-300">
            {subtitle}
          </span>

          <h3 className="mt-2 text-xl font-bold text-white">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close concept details"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-400">
        {overview}
      </p>

      <div className="mt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
          What you will learn
        </h4>

        <div className="space-y-2">
          {subtopics.map((topic, index) => (
            <div
              key={topic}
              className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-xs font-bold text-blue-300">
                {index + 1}
              </span>

              <span className="pt-1 text-sm text-slate-300">
                {topic}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
          Prerequisites
        </h4>

        <div className="flex flex-wrap gap-2">
          {prerequisites.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-300">
          Up next
        </h4>

        <div className="flex flex-wrap gap-2">
          {next.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs text-blue-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onExplore}
        className="mt-7 w-full rounded-xl bg-blue-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-400"
      >
        Explore Learning Activity →
      </button>
    </div>
  );
}

// --------------------------------------------------
// MAIN COURSE ROADMAP
// --------------------------------------------------

export default function CourseRoadmap({ initialOpen = false }) {
  const [roadmapOpen, setRoadmapOpen] = useState(initialOpen);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showLearningActivity, setShowLearningActivity] = useState(false);

  const selectedNode = conceptNodes.find(
    (node) => node.id === selectedNodeId
  );

  const flowNodes = conceptNodes.map((node) => ({
    ...node,
    type: "concept",
  }));

  // Open the learning activity selected by the user.
  if (showLearningActivity) {
    return (
      <LearningActivity
        onBack={() => setShowLearningActivity(false)}
      />
    );
  }

  // Show the course introduction first.
  if (!roadmapOpen) {
    return (
      <div className="min-h-[75vh] bg-[#0b1220] px-4 py-8 text-white md:px-8">
        <div className="mx-auto mb-8 max-w-5xl">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-6 text-sm text-slate-400 transition hover:text-white"
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
            Select a course to explore its concepts and learning activities.
          </p>
        </div>

        <CourseCard onOpen={() => setRoadmapOpen(true)} />
      </div>
    );
  }

  // Display the interactive concept graph.
  return (
    <div className="min-h-screen bg-[#0b1220] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-[1500px]">
        <button
          type="button"
          onClick={() => {
            setRoadmapOpen(false);
            setSelectedNodeId(null);
          }}
          className="mb-5 text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Courses
        </button>

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              JAVA · LEARNING ROADMAP
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Object-Oriented Programming
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Follow the connections between concepts. Click any node to
              view its learning objectives, prerequisites, and next topics.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-bold text-white">14</span>
              <span className="ml-2">Concepts</span>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="font-bold text-white">Java</span>
              <span className="ml-2">Course</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
            Core concepts
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
            Supporting concepts
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            Advanced concepts
          </span>

          <span className="ml-auto">
            Scroll to zoom · Drag to navigate
          </span>
        </div>

        <div
          className="relative h-[760px] overflow-hidden rounded-2xl border border-white/10 bg-[#0e1729]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 45%)",
          }}
        >
          <ReactFlow
            nodes={flowNodes}
            edges={conceptEdges}
            nodeTypes={nodeTypes}
            onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            onPaneClick={() => setSelectedNodeId(null)}
            fitView
            fitViewOptions={{
              padding: 0.2,
              minZoom: 0.35,
              maxZoom: 1,
            }}
            minZoom={0.2}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{
              type: "smoothstep",
            }}
          >
            <Background
              color="#263650"
              gap={24}
              size={1}
            />

            <Controls
              showInteractive={false}
              className="!overflow-hidden !rounded-xl !border !border-white/10 !bg-[#101b32] [&>button]:!border-white/10 [&>button]:!bg-[#101b32] [&>button]:!fill-slate-300 [&>button:hover]:!bg-[#1b2a45]"
            />
          </ReactFlow>

          {selectedNode && (
            <NodeDetails
              node={selectedNode}
              onClose={() => setSelectedNodeId(null)}
              onExplore={() => setShowLearningActivity(true)}
            />
          )}
        </div>

        <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center">
          <p className="text-xs leading-5 text-slate-500">
            Tip: Start with OOP Fundamentals and progress through the
            connected concepts.
          </p>

          <button
            type="button"
            onClick={() => {
              setSelectedNodeId("fundamentals");
            }}
            className="shrink-0 rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-2.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-400/20"
          >
            Start Learning →
          </button>
        </div>
      </div>
    </div>
  );
}