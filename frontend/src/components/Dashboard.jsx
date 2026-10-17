import { useEffect, useState } from "react";
import Courses from "./Courses";

const DEFAULT_SETTINGS = {
  name: "Student",
  email: "",
  learningGoal: "30",
  experience: "Beginner",
  learningStyle: "Examples first",
  dailyReminder: true,
  weeklySummary: true,
  soundEffects: false,
  compactLayout: false,
};

const SETTINGS_STORAGE_KEY = "adaptivelearn-settings";

const navigation = [
  { name: "Home", icon: "⌂" },
  { name: "Courses", icon: "▤" },
  { name: "Completed Modules", icon: "✓" },
  { name: "Activities", icon: "◷" },
  { name: "Settings", icon: "⚙" },
  { name: "About", icon: "ⓘ" },
];

const demoStats = [
  {
    label: "Enrolled Courses",
    value: "01",
    description: "Your learning journey starts here",
    icon: "▤",
    color: "text-blue-300 bg-blue-400/10",
  },
  {
    label: "Modules Completed",
    value: "01",
    description: "Keep up the momentum",
    icon: "✓",
    color: "text-emerald-300 bg-emerald-400/10",
  },
  {
    label: "Learning Activities",
    value: "08",
    description: "Practice makes progress",
    icon: "⌁",
    color: "text-violet-300 bg-violet-400/10",
  },
];

function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }
  } catch (error) {
    console.error("Could not load saved settings:", error);
  }

  return DEFAULT_SETTINGS;
}

function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-300">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      </div>

      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-xs font-medium text-blue-300 transition hover:text-blue-200"
        >
          {action} →
        </button>
      )}
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{stat.label}</p>

          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
            {stat.value}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${stat.color}`}
        >
          {stat.icon}
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-500">{stat.description}</p>
    </article>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl py-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-300">
        {eyebrow}
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
        {title}
      </h1>

      <p className="mt-4 text-sm leading-7 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-blue-400/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-400/10 text-xl text-blue-300">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}

function SettingsGroup({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-white">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

function SettingField({ label, description, children }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="sm:max-w-sm">
        <p className="text-sm font-medium text-slate-200">{label}</p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="sm:w-64">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
        checked ? "bg-blue-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function AboutPage({ onNavigate }) {
  const features = [
    {
      icon: "⌘",
      title: "Concept-based learning",
      description:
        "Break complex subjects into smaller concepts connected through a structured learning roadmap.",
    },
    {
      icon: "◈",
      title: "Personalized learning",
      description:
        "Use learning preferences and future performance data to support a learning path suited to each student.",
    },
    {
      icon: "✓",
      title: "Assessment and practice",
      description:
        "Bring learning activities, practice questions, and assessments into one learning environment.",
    },
    {
      icon: "↗",
      title: "Progress tracking",
      description:
        "Build toward tracking completed concepts, assessment results, strengths, and topics that need revision.",
    },
    {
      icon: "◎",
      title: "Interactive roadmap",
      description:
        "Explore C++ OOP concepts visually and inspect prerequisites and related topics.",
    },
    {
      icon: "✦",
      title: "Learning support",
      description:
        "Create a foundation for future recommendations, guided revision, and AI-assisted learning.",
    },
  ];

  return (
    <div className="space-y-10 py-4">
      <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-7 sm:p-10 md:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium text-blue-200">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            OUR PROJECT
          </span>

          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            Learning that adapts
            <br />
            <span className="text-blue-300">to you.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            AdaptiveLearn AI is an adaptive learning and assessment portal
            designed to help students explore concepts, practice what they
            learn, and work toward mastering topics at their own pace.
          </p>

          <button
            type="button"
            onClick={() => onNavigate("Courses")}
            className="mt-7 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            Explore the learning roadmap →
          </button>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="THE PROBLEM"
          title="Why are we building this?"
        />

        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-xl text-rose-300">
              !
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white">
                One learning path doesn't work for everyone.
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                Students have different levels of prior knowledge, learning
                speeds, and areas of difficulty. A fixed learning experience
                may not provide enough targeted practice or guidance for
                every student. Our project aims to provide a more structured
                and personalized learning experience through concept-based
                content, assessments, and adaptive recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="What AdaptiveLearn AI offers"
        />

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <InfoCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="LEARNING WORKFLOW"
          title="From concepts to confidence"
        />

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            {
              number: "01",
              title: "Choose a course",
              description: "Start with a subject such as C++ OOP.",
            },
            {
              number: "02",
              title: "Explore concepts",
              description: "Follow the roadmap and learn prerequisites.",
            },
            {
              number: "03",
              title: "Practice",
              description: "Work through examples and learning activities.",
            },
            {
              number: "04",
              title: "Assess & improve",
              description:
                "Use assessment results to identify what to revise next.",
            },
          ].map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <span className="text-xs font-bold tracking-widest text-blue-300">
                STEP {step.number}
              </span>

              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="BUILT WITH"
          title="Technology stack"
        />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            ["React", "Frontend UI"],
            ["Tailwind CSS", "Interface styling"],
            ["Node.js", "Backend runtime"],
            ["Express.js", "API layer"],
            ["PostgreSQL", "Database"],
          ].map(([name, purpose]) => (
            <div
              key={name}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <p className="font-semibold text-white">{name}</p>
              <p className="mt-1 text-xs text-slate-500">{purpose}</p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-6 text-slate-500">
          The portal is being developed in stages. Some adaptive learning,
          assessment, and progress-tracking capabilities may require backend
          integration before they are fully functional.
        </p>
      </section>

      <section className="rounded-2xl border border-blue-400/20 bg-blue-500/[0.06] p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-blue-300">
          OUR GOAL
        </p>

        <h2 className="mt-3 text-2xl font-bold text-white">
          Learn smarter. Grow further.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Make learning more accessible, structured, interactive, and
          responsive to individual student needs.
        </p>
      </section>
    </div>
  );
}

function SettingsPage({ settings, updateSetting, onReset }) {
  const [savedMessage, setSavedMessage] = useState("");

  function handleChange(key, value) {
    updateSetting(key, value);
    setSavedMessage("");
  }

  return (
    <div className="space-y-7 py-4">
      <PageHeading
        eyebrow="PREFERENCES"
        title="Settings"
        description="Personalize your learning workspace and choose how you prefer to study."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <SettingsGroup
            title="Profile"
            description="Customize the details displayed in your learning workspace."
          >
            <SettingField
              label="Display name"
              description="The name shown in your dashboard."
            >
              <input
                type="text"
                value={settings.name}
                maxLength={60}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400"
              />
            </SettingField>

            <SettingField
              label="Email address"
              description="For display until account integration is added."
            >
              <input
                type="email"
                value={settings.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400"
              />
            </SettingField>
          </SettingsGroup>

          <SettingsGroup
            title="Learning preferences"
            description="Choose a learning target and a style that works for you."
          >
            <SettingField
              label="Daily learning goal"
              description="Your intended daily study time."
            >
              <select
                value={settings.learningGoal}
                onChange={(event) =>
                  handleChange("learningGoal", event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </SettingField>

            <SettingField
              label="Current experience"
              description="Your self-selected starting level."
            >
              <select
                value={settings.experience}
                onChange={(event) =>
                  handleChange("experience", event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </SettingField>

            <SettingField
              label="Preferred learning style"
              description="How you prefer to approach new topics."
            >
              <select
                value={settings.learningStyle}
                onChange={(event) =>
                  handleChange("learningStyle", event.target.value)
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              >
                <option>Examples first</option>
                <option>Theory first</option>
                <option>Practice first</option>
                <option>Balanced learning</option>
              </select>
            </SettingField>
          </SettingsGroup>

          <SettingsGroup
            title="Notifications"
            description="Choose which notification preferences you want to enable."
          >
            <SettingField
              label="Daily learning reminder"
              description="Preference for future study reminders."
            >
              <div className="flex justify-end">
                <Toggle
                  label="Daily learning reminder"
                  checked={settings.dailyReminder}
                  onChange={(value) => handleChange("dailyReminder", value)}
                />
              </div>
            </SettingField>

            <SettingField
              label="Weekly learning summary"
              description="Preference for future progress summaries."
            >
              <div className="flex justify-end">
                <Toggle
                  label="Weekly learning summary"
                  checked={settings.weeklySummary}
                  onChange={(value) => handleChange("weeklySummary", value)}
                />
              </div>
            </SettingField>
          </SettingsGroup>

          <SettingsGroup
            title="Interface preferences"
            description="Adjust small details of your workspace."
          >
            <SettingField
              label="Sound effects"
              description="Preference for optional interface sounds."
            >
              <div className="flex justify-end">
                <Toggle
                  label="Sound effects"
                  checked={settings.soundEffects}
                  onChange={(value) => handleChange("soundEffects", value)}
                />
              </div>
            </SettingField>

            <SettingField
              label="Compact layout"
              description="Save this preference for a future compact interface."
            >
              <div className="flex justify-end">
                <Toggle
                  label="Compact layout"
                  checked={settings.compactLayout}
                  onChange={(value) => handleChange("compactLayout", value)}
                />
              </div>
            </SettingField>
          </SettingsGroup>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              Changes are saved in this browser automatically.
            </p>

            <button
              type="button"
              onClick={() => {
                setSavedMessage("Your preferences are saved.");
                window.setTimeout(() => setSavedMessage(""), 2500);
              }}
              className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Confirm preferences
            </button>
          </div>

          {savedMessage && (
            <p
              role="status"
              className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-300"
            >
              ✓ {savedMessage}
            </p>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-950/80 to-slate-900 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-400/15 text-2xl font-bold text-blue-200">
              {(settings.name.trim() || "S").charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              {settings.name.trim() || "Student"}
            </h2>

            <p className="mt-1 break-all text-sm text-slate-400">
              {settings.email || "No email added"}
            </p>

            <span className="mt-4 inline-flex rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs text-blue-200">
              {settings.experience} learner
            </span>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs text-slate-400">Daily learning goal</p>

              <p className="mt-2 text-2xl font-bold text-white">
                {settings.learningGoal}{" "}
                <span className="text-sm font-normal text-slate-400">
                  minutes
                </span>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="font-semibold text-white">Account integration</h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              These preferences currently belong to this browser. Connecting
              them to your authenticated account requires backend integration.
            </p>

            <span className="mt-4 inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              Frontend only
            </span>
          </section>

          <section className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-5">
            <h3 className="font-semibold text-white">Reset preferences</h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Restore the default profile and learning preferences.
            </p>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all your saved learning preferences to their defaults?"
                  )
                ) {
                  onReset();
                  setSavedMessage("Preferences have been reset.");
                }
              }}
              className="mt-5 w-full rounded-xl border border-rose-400/30 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10"
            >
              Reset settings
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save settings:", error);
    }
  }, [settings]);

  function goTo(page) {
    setActivePage(page);
    setProfileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateSetting(key, value) {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function resetSettings() {
    setSettings({ ...DEFAULT_SETTINGS });
  }

  function renderHome() {
    return (
      <>
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-blue-300">
              YOUR PERSONAL LEARNING SPACE
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Welcome back, {settings.name.trim() || "Student"}!
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
              Every learner is different. Discover a learning experience that
              adapts to your knowledge, pace, and progress.
            </p>

            <button
              type="button"
              onClick={() => goTo("Courses")}
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Explore Courses <span>→</span>
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-10 hidden h-36 w-36 items-center justify-center rounded-full border border-blue-300/20 md:flex">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-300/30 bg-blue-400/10 text-5xl text-blue-200 shadow-2xl shadow-blue-500/20">
              ✦
            </div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {demoStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        <section className="mt-10">
          <SectionHeading
            eyebrow="PICK UP WHERE YOU LEFT OFF"
            title="Continue Learning"
            action="View course"
            onAction={() => goTo("Courses")}
          />

          <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:flex-row md:items-center md:p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-lg font-bold text-blue-200">
              OOP
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-blue-300">
                C++ PROGRAMMING
              </span>

              <h3 className="mt-2 text-lg font-semibold text-white">
                Object-Oriented Programming
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Explore your concept roadmap, from classes and objects to
                advanced OOP concepts.
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700">
                  <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" />
                </div>

                <span className="whitespace-nowrap text-xs text-slate-400">
                  Getting started
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => goTo("Courses")}
              className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-blue-400/30 bg-blue-500/10 text-xl text-blue-200 transition hover:bg-blue-500/20 md:self-center"
              aria-label="Continue course"
            >
              →
            </button>
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            eyebrow="BUILT AROUND YOUR GOALS"
            title="My Courses"
            action="Explore course"
            onAction={() => goTo("Courses")}
          />

          <button
            type="button"
            onClick={() => goTo("Courses")}
            className="mt-5 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left transition hover:border-blue-400/40 sm:p-7"
          >
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 font-bold text-indigo-200">
                OOP
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-widest text-blue-300">
                  C++ COMPUTER SCIENCE
                </p>

                <h3 className="mt-2 text-xl font-semibold text-white">
                  Object-Oriented Programming
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Explore classes and objects, methods, inheritance,
                  polymorphism, abstraction, interfaces, and advanced OOP.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                  Open course roadmap →
                </span>
              </div>
            </div>
          </button>
        </section>
      </>
    );
  }

  function renderOtherPage() {
    if (activePage === "About") {
      return <AboutPage onNavigate={goTo} />;
    }

    if (activePage === "Settings") {
      return (
        <SettingsPage
          settings={settings}
          updateSetting={updateSetting}
          onReset={resetSettings}
        />
      );
    }

    if (activePage === "Completed Modules") {
      return (
        <section className="py-8">
          <PageHeading
            eyebrow="YOUR ACHIEVEMENTS"
            title="Completed Modules"
            description="Your completed concepts and learning milestones will appear here once progress tracking is connected."
          />

          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="text-3xl">◈</div>

            <h2 className="mt-4 font-semibold text-white">
              Your learning milestones
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Once activity completion is connected to the backend, your
              completed concepts and learning history can be displayed here.
            </p>

            <button
              type="button"
              onClick={() => goTo("Courses")}
              className="mt-5 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Explore courses →
            </button>
          </div>
        </section>
      );
    }

    if (activePage === "Activities") {
      return (
        <section className="py-8">
          <PageHeading
            eyebrow="YOUR PRACTICE SPACE"
            title="Learning Activities"
            description="Explore learning activities and practice concepts through the course roadmap."
          />

          <button
            type="button"
            onClick={() => goTo("Courses")}
            className="mt-5 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            View course roadmap →
          </button>
        </section>
      );
    }

    return renderHome();
  }

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0b1120]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
          <button
            type="button"
            onClick={() => goTo("Home")}
            className="flex shrink-0 items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
              A<span className="text-cyan-200">+</span>
            </span>

            <span>
              <span className="block text-base font-bold tracking-tight text-white">
                Adaptive<span className="text-blue-400">Learn</span>
              </span>

              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.18em] text-slate-500">
                AI LEARNING PORTAL
              </span>
            </span>
          </button>

          <nav className="hidden flex-1 justify-center gap-1 xl:flex">
            {navigation.map((item) => (
              <button
                type="button"
                key={item.name}
                onClick={() => goTo(item.name)}
                className={`rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                  activePage === item.name
                    ? "bg-blue-500/10 text-blue-300"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2 py-2 transition hover:border-slate-700 sm:px-3"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-sm font-bold text-white">
                {(settings.name.trim() || "S").charAt(0).toUpperCase()}
              </span>

              <span className="hidden max-w-24 truncate text-xs font-medium text-slate-200 sm:block">
                {settings.name.trim() || "Student"}
              </span>

              <span className="text-slate-500">⌄</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                <p className="truncate px-3 py-2 text-xs text-slate-400">
                  {settings.email || "Local demo profile"}
                </p>

                <button
                  type="button"
                  onClick={() => goTo("Settings")}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => goTo("About")}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                >
                  About the project
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-slate-800/70 px-4 py-2 xl:hidden">
          {navigation.map((item) => (
            <button
              type="button"
              key={item.name}
              onClick={() => goTo(item.name)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs ${
                activePage === item.name
                  ? "bg-blue-500/15 text-blue-300"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-8 pt-7 lg:px-10 lg:pt-9">
        <div className="mb-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-300">{activePage}</span>
          </div>

          <span className="flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Adaptive learning workspace
          </span>
        </div>

        {activePage === "Home" ? (
          renderHome()
        ) : activePage === "Courses" ? (
          <Courses />
        ) : (
          renderOtherPage()
        )}

        <footer className="mt-14 flex flex-col gap-3 border-t border-slate-800 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© 2026 AdaptiveLearn AI</span>
          <span>Learn smarter. Grow further. ✦</span>
        </footer>
      </main>
    </div>
  );
}