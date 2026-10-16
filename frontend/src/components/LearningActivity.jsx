import { useState } from "react";

const fundamentals = [
  {
    title: "What is Object-Oriented Programming?",
    explanation:
      "OOP is a programming approach that organizes software around objects containing data and behaviour.",
    takeaway: "OOP helps organize code into reusable, manageable units.",
  },
  {
    title: "What is a class?",
    explanation:
      "A class is a blueprint that defines the fields and methods its objects can have.",
    takeaway: "A class defines the structure; objects are created from it.",
  },
  {
    title: "What is an object?",
    explanation:
      "An object is an instance of a class. Different objects can store different values in their fields.",
    takeaway: "Objects represent individual instances of a class.",
  },
  {
    title: "State and behaviour",
    explanation:
      "State is represented by fields, such as name and age. Behaviour is represented by methods, such as display() or study().",
    takeaway: "Fields store information; methods perform actions.",
  },
];

const examples = [
  {
    title: "Example 1: Creating a class and object",
    description:
      "Create a Student object, give it a name and age, and display its details.",
    code: `class Student {
    String name = "Rahul";
    int age = 20;

    void display() {
        System.out.println(name);
        System.out.println(age);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        s1.display();
    }
}`,
    output: "Rahul\n20",
  },
  {
    title: "Example 2: Multiple objects",
    description:
      "Two objects use the same class but store different names.",
    code: `class Student {
    String name;

    void display() {
        System.out.println("Hello, " + name);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();
        Student s2 = new Student();

        s1.name = "Rahul";
        s2.name = "Priya";

        s1.display();
        s2.display();
    }
}`,
    output: "Hello, Rahul\nHello, Priya",
  },
];

export default function LearningActivity({
  onBack,
  onNext,
}) {
  const [activeTab, setActiveTab] = useState("learn");
  const [completed, setCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 text-sm text-blue-300 hover:text-blue-200"
        >
          ← Back to Roadmap
        </button>

        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-blue-950/70 to-slate-900 p-6 md:p-9">
          <p className="text-xs font-semibold tracking-[0.2em] text-blue-300">
            JAVA · OBJECT-ORIENTED PROGRAMMING
          </p>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Fundamentals
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            Start your OOP journey by understanding the basic ideas behind
            classes, objects, state, and behaviour.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="rounded-lg border border-slate-700 px-3 py-2">
              4 Learning Points
            </span>
            <span className="rounded-lg border border-slate-700 px-3 py-2">
              2 Java Examples
            </span>
            <span className="rounded-lg border border-slate-700 px-3 py-2">
              Beginner
            </span>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("learn")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "learn"
                ? "border-blue-400 text-blue-300"
                : "border-transparent text-slate-400"
            }`}
          >
            Learn
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("examples")}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === "examples"
                ? "border-blue-400 text-blue-300"
                : "border-transparent text-slate-400"
            }`}
          >
            Examples
          </button>
        </div>

        {activeTab === "learn" ? (
          <section className="mt-7 space-y-4">
            {fundamentals.map((point, index) => (
              <article
                key={point.title}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 md:p-6"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-sm font-semibold text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {point.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      {point.explanation}
                    </p>

                    <div className="mt-4 rounded-xl border border-blue-400/15 bg-blue-500/5 p-4">
                      <p className="text-xs font-semibold text-blue-300">
                        KEY TAKEAWAY
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {point.takeaway}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-7 space-y-6">
            {examples.map((example) => (
              <article
                key={example.title}
                className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60"
              >
                <div className="p-5 md:p-6">
                  <h2 className="text-lg font-semibold text-white">
                    {example.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {example.description}
                  </p>
                </div>

                <div className="border-y border-slate-800 bg-[#070b13] p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-300">
                      Java
                    </span>
                    <span className="text-xs text-slate-500">
                      Code example
                    </span>
                  </div>

                  <pre className="overflow-x-auto text-sm leading-6 text-slate-200">
                    <code>{example.code}</code>
                  </pre>
                </div>

                <div className="p-5 md:p-6">
                  <h3 className="text-sm font-semibold text-white">
                    Expected output
                  </h3>

                  <pre className="mt-3 overflow-x-auto rounded-xl border border-slate-800 bg-black/30 p-4 text-sm leading-6 text-emerald-300">
                    {example.output}
                  </pre>
                </div>
              </article>
            ))}
          </section>
        )}

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-white">
              Finished learning the fundamentals?
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Mark this activity complete and continue to the next topic.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCompleted(true);
              onNext?.();
            }}
            className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
          >
            {completed ? "Completed ✓" : "Complete & Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}