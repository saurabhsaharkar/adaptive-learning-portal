import { useState } from "react";
import CourseRoadmap from "./CourseRoadmap";

const navigation = [
  { name: "Home", icon: "⌂" },
  { name: "Courses", icon: "▤" },
  { name: "Completed Modules", icon: "✓" },
  { name: "Activities", icon: "◷" },
  { name: "Settings", icon: "⚙" },
  { name: "About", icon: "ⓘ" },
];

const demoStats = [
  { label: "Enrolled Courses", value: "01", description: "Your learning journey starts here", icon: "▤", color: "text-blue-300 bg-blue-400/10" },
  { label: "Modules Completed", value: "01", description: "Keep up the momentum", icon: "✓", color: "text-emerald-300 bg-emerald-400/10" },
  { label: "Learning Activities", value: "08", description: "Practice makes progress", icon: "⌁", color: "text-violet-300 bg-violet-400/10" },
];

function SectionHeading({ eyebrow, title, action, onAction }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-300">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {action && (
        <button type="button" onClick={onAction} className="shrink-0 text-xs font-medium text-blue-300 transition hover:text-blue-200">
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
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{stat.value}</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${stat.color}`}>{stat.icon}</span>
      </div>
      <p className="mt-3 text-xs text-slate-500">{stat.description}</p>
    </article>
  );
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl py-4">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-blue-300">{eyebrow}</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-slate-400">{description}</p>
    </div>
  );
}

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Home");
  const [profileOpen, setProfileOpen] = useState(false);

  function goTo(page) {
    setActivePage(page);
    setProfileOpen(false);
  }

  function renderHome() {
    return (
      <>
        <section className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 md:p-12">
          <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-semibold tracking-[0.2em] text-blue-300">YOUR PERSONAL LEARNING SPACE</span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-5xl">Learn at your own pace.</h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 md:text-base">
              Every learner is different. Discover a learning experience that adapts to your knowledge, pace, and progress.
            </p>
            <button type="button" onClick={() => goTo("Courses")} className="mt-7 inline-flex items-center gap-3 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
              Explore Courses <span>→</span>
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-8 right-10 hidden h-36 w-36 items-center justify-center rounded-full border border-blue-300/20 md:flex">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-300/30 bg-blue-400/10 text-5xl text-blue-200 shadow-2xl shadow-blue-500/20">✦</div>
          </div>
        </section>

        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {demoStats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
        </section>

        <section className="mt-10">
          <SectionHeading eyebrow="PICK UP WHERE YOU LEFT OFF" title="Continue Learning" action="View course" onAction={() => goTo("Courses")} />
          <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 md:flex-row md:items-center md:p-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-lg font-bold text-blue-200">OOP</div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-blue-300">JAVA · PROGRAMMING</span>
              <h3 className="mt-2 text-lg font-semibold text-white">Object-Oriented Programming</h3>
              <p className="mt-2 text-sm text-slate-400">Explore your concept roadmap, from classes and objects to advanced OOP concepts.</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-700"><div className="h-full w-[15%] rounded-full bg-gradient-to-r from-blue-400 to-indigo-400" /></div>
                <span className="whitespace-nowrap text-xs text-slate-400">Getting started</span>
              </div>
            </div>
            <button type="button" onClick={() => goTo("Courses")} className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-blue-400/30 bg-blue-500/10 text-xl text-blue-200 transition hover:bg-blue-500/20 md:self-center" aria-label="Continue course">→</button>
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading eyebrow="BUILT AROUND YOUR GOALS" title="My Courses" action="Explore course" onAction={() => goTo("Courses")} />
          <button type="button" onClick={() => goTo("Courses")} className="mt-5 w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-left transition hover:border-blue-400/40 sm:p-7">
            <div className="flex items-start gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 font-bold text-indigo-200">OOP</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold tracking-widest text-blue-300">JAVA · COMPUTER SCIENCE</p>
                <h3 className="mt-2 text-xl font-semibold text-white">Object-Oriented Programming</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">Explore classes and objects, methods, inheritance, polymorphism, abstraction, interfaces, and advanced OOP.</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Open course roadmap →</span>
              </div>
            </div>
          </button>
        </section>
      </>
    );
  }

  function renderOtherPage() {
    const pages = {
      "Completed Modules": { eyebrow: "YOUR ACHIEVEMENTS", title: "Completed Modules", description: "Your completed concepts and learning milestones will appear here once progress tracking is connected." },
      Activities: { eyebrow: "YOUR PRACTICE SPACE", title: "Learning Activities", description: "Exercises, assessments, and viva sessions will be available through your course roadmap." },
      Settings: { eyebrow: "MAKE IT YOURS", title: "Settings", description: "Your account preferences and learning settings will be added here." },
      About: { eyebrow: "ABOUT ADAPTIVELEARN AI", title: "Learning that adapts to you.", description: "An adaptive learning and assessment portal designed to help students learn at their own pace and demonstrate their understanding." },
    };
    const page = pages[activePage];
    if (!page) return renderHome();
    return (
      <section className="py-8">
        <PageHeading {...page} />
        {activePage === "Activities" && (
          <button type="button" onClick={() => goTo("Courses")} className="mt-5 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">
            View course roadmap →
          </button>
        )}
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0b1120]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-4 px-5 py-3 lg:px-10">
          <button type="button" onClick={() => goTo("Home")} className="flex shrink-0 items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">A<span className="text-cyan-200">+</span></span>
            <span>
              <span className="block text-base font-bold tracking-tight text-white">Adaptive<span className="text-blue-400">Learn</span></span>
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.18em] text-slate-500">AI LEARNING PORTAL</span>
            </span>
          </button>

          <nav className="hidden flex-1 justify-center gap-1 xl:flex">
            {navigation.map((item) => (
              <button type="button" key={item.name} onClick={() => goTo(item.name)} className={`rounded-xl px-3 py-2.5 text-xs font-medium transition ${activePage === item.name ? "bg-blue-500/10 text-blue-300" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <span className="mr-2">{item.icon}</span>{item.name}
              </button>
            ))}
          </nav>

          <div className="relative shrink-0">
            <button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2 py-2 transition hover:border-slate-700 sm:px-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500 text-sm font-bold text-white">S</span>
              <span className="hidden text-xs font-medium text-slate-200 sm:block">Student</span>
              <span className="text-slate-500">⌄</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-14 w-48 rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
                <p className="px-3 py-2 text-xs text-slate-400">Demo profile</p>
                <button type="button" onClick={() => goTo("Settings")} className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800">Settings</button>
              </div>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto border-t border-slate-800/70 px-4 py-2 xl:hidden">
          {navigation.map((item) => (
            <button type="button" key={item.name} onClick={() => goTo(item.name)} className={`shrink-0 rounded-lg px-3 py-2 text-xs ${activePage === item.name ? "bg-blue-500/15 text-blue-300" : "text-slate-400 hover:bg-slate-800"}`}>
              {item.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 pb-8 pt-7 lg:px-10 lg:pt-9">
        <div className="mb-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500"><span>Workspace</span><span>/</span><span className="text-slate-300">{activePage}</span></div>
          <span className="flex items-center gap-2 text-[10px] text-slate-400 sm:text-xs"><span className="h-2 w-2 rounded-full bg-emerald-400" />Adaptive learning workspace</span>
        </div>

        {activePage === "Home" ? renderHome() : activePage === "Courses" ? <CourseRoadmap /> : renderOtherPage()}

        <footer className="mt-14 flex flex-col gap-3 border-t border-slate-800 py-6 text-center text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© 2026 AdaptiveLearn AI</span><span>Learn smarter. Grow further. ✦</span>
        </footer>
      </main>
    </div>
  );
}
