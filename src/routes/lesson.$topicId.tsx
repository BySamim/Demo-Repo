import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { chapters, type Topic, type Chapter } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Languages,
  Pause,
  Play,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function findTopic(topicId: string): { topic: Topic; chapter: Chapter } | null {
  for (const c of chapters) {
    const t = c.topics.find((x) => x.id === topicId);
    if (t) return { topic: t, chapter: c };
  }
  return null;
}

export const Route = createFileRoute("/lesson/$topicId")({
  head: ({ params }) => {
    const found = findTopic(params.topicId);
    return {
      meta: [
        { title: found ? `${found.topic.title} · AI Lesson` : "Lesson · SharmaAI" },
        { name: "description", content: found?.topic.summary ?? "AI teacher lesson" },
      ],
    };
  },
  loader: ({ params }): { topic: Topic; chapter: Chapter } => {
    const found = findTopic(params.topicId);
    if (!found) throw notFound();
    return found;
  },
  component: LessonView,
  notFoundComponent: () => <div className="p-6 sm:p-10">Topic not found.</div>,
  errorComponent: ({ error }) => (
    <div className="p-6 text-destructive sm:p-10">{error.message}</div>
  ),
});

function LessonView() {
  const { topic, chapter } = Route.useLoaderData() as { topic: Topic; chapter: Chapter };
  const [playing, setPlaying] = useState(true);
  const [lang, setLang] = useState<"EN" | "HI">("EN");
  const [tab, setTab] = useState<"theory" | "visual" | "real" | "quiz">("theory");

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          to="/chapters/$chapterId"
          params={{ chapterId: chapter.id }}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Chapter {chapter.number}
        </Link>

        <div className="mt-4 grid max-w-full gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          {/* Video / Whiteboard */}
          <div className="min-w-0 max-w-full">
            <div className="relative w-full max-w-full overflow-hidden rounded-2xl bg-gradient-board p-3 text-white shadow-glow sm:rounded-3xl sm:p-8">
              {/* Whiteboard content */}
              <div className="mb-4 flex items-center justify-end gap-2 sm:absolute sm:right-6 sm:top-6 sm:mb-0">
                <button
                  onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
                  className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/20 hover:bg-white/20"
                >
                  <Languages className="h-3 w-3" />
                  {lang === "EN" ? "English" : "हिन्दी"}
                </button>
              </div>

              <div className="text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
                AI Teacher · Topic {chapter.number}.x
              </div>
              <h1 className="mt-2 font-display text-xl font-bold leading-tight sm:text-3xl">
                {topic.title}
              </h1>
              <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/70 sm:line-clamp-none sm:text-sm">
                {topic.summary}
              </p>

              <div className="mt-4 sm:hidden">
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[oklch(0.18_0.04_265)] font-mono ring-1 ring-white/5">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/20 px-3 py-2 text-[10px] text-white/45">
                    <span className="truncate">// {topic.title}</span>
                    <span className="ml-2 shrink-0">04:12</span>
                  </div>
                  <div className="flex h-full flex-col items-center justify-center px-4 pb-10 pt-8 text-center">
                    <div className="text-2xl font-semibold">a = bq + r</div>
                    <div className="mt-1 text-[11px] text-white/55">where 0 ≤ r &lt; b</div>
                    <div className="mt-3 max-w-[15rem] text-[10px] leading-relaxed text-white/65">
                      Apply Euclid's lemma repeatedly until the remainder becomes zero.
                    </div>
                  </div>
                  <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/25 p-2.5 backdrop-blur-sm ring-1 ring-white/10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPlaying((p) => !p)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-foreground"
                      >
                        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between text-[10px] text-white/60">
                          <span>04:12</span>
                          <span>{topic.duration}</span>
                        </div>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
                          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-accent to-primary-glow" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 hidden w-full max-w-full flex-col overflow-hidden rounded-xl bg-[oklch(0.18_0.04_265)] p-3 font-mono ring-1 ring-white/5 sm:mt-6 sm:flex sm:aspect-video sm:rounded-2xl sm:p-8">
                <div className="truncate text-[11px] text-white/40 sm:text-xs">
                  // {topic.title}
                </div>
                <div className="mt-3 text-2xl sm:mt-4 sm:text-3xl">a = bq + r</div>
                <div className="mt-1 text-xs text-white/50 sm:text-sm">where 0 ≤ r &lt; b</div>
                <div className="mt-5 text-[11px] text-white/40 sm:mt-8 sm:text-xs">
                  Step-by-step
                </div>
                <div className="mt-2 space-y-1 break-words text-[11px] leading-relaxed text-white/90 sm:text-base">
                  <div>1. Apply division lemma to a and b</div>
                  <div>2. If r = 0, HCF is b</div>
                  <div>3. Else apply lemma to b and r, repeat</div>
                </div>
                <div className="mt-auto break-words pt-4 text-[11px] text-accent sm:pt-6 sm:text-sm">
                  ✦ Animated whiteboard plays as Ms. Nova explains
                </div>
              </div>

              {/* Player */}
              <div className="mt-4 hidden w-full min-w-0 max-w-full items-center gap-2 rounded-xl bg-white/5 p-2.5 ring-1 ring-white/10 sm:mt-5 sm:flex sm:rounded-2xl sm:gap-4 sm:p-4">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground transition hover:scale-105 sm:h-11 sm:w-11"
                >
                  {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-xs text-white/60">
                    <span>04:12</span>
                    <span>{topic.duration}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-accent to-primary-glow" />
                  </div>
                </div>
                <Volume2 className="hidden h-4 w-4 text-white/60 sm:block" />
                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-gradient-hero sm:flex">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 rounded-3xl border border-border bg-card shadow-soft">
              <div className="flex flex-wrap gap-1 border-b border-border p-2">
                {(
                  [
                    ["theory", "Theory"],
                    ["visual", "Visual"],
                    ["real", "Real-life Example"],
                    ["quiz", "Quick Quiz"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      tab === id
                        ? "bg-gradient-hero text-primary-foreground shadow-soft"
                        : "text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="p-4 text-sm leading-relaxed sm:p-6">
                {tab === "theory" && (
                  <div className="space-y-3">
                    <p>
                      The <b>Division Lemma</b> states that for any two positive integers <i>a</i>{" "}
                      and <i>b</i>, there exist unique integers <i>q</i> and <i>r</i> such that{" "}
                      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono">
                        a = bq + r
                      </code>
                      , where 0 ≤ r &lt; b.
                    </p>
                    <p>
                      This is the foundation for finding the <b>Highest Common Factor (HCF)</b>{" "}
                      using Euclid's algorithm — repeatedly applying the lemma until the remainder
                      becomes zero.
                    </p>
                  </div>
                )}
                {tab === "visual" && (
                  <div>
                    <p className="text-muted-foreground">
                      Imagine dividing a strip of length <b>455</b> into pieces of length <b>42</b>.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="h-10 w-10 rounded bg-gradient-hero" />
                      ))}
                      <div className="flex h-10 items-center justify-center rounded bg-accent px-3 text-xs font-semibold text-accent-foreground">
                        remainder 35
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      10 full pieces of 42 fit into 455, leaving 35 — exactly what the lemma says.
                    </p>
                  </div>
                )}
                {tab === "real" && (
                  <p>
                    You have <b>455 candies</b> and want to pack them into boxes of <b>42</b>. How
                    many full boxes and how many leftovers? The lemma answers it instantly: 10 full
                    boxes, 35 leftover.
                  </p>
                )}
                {tab === "quiz" && (
                  <div className="space-y-4">
                    <QuizQ
                      q="Find HCF(96, 36) using Euclid's algorithm."
                      options={["12", "6", "18", "24"]}
                      correct={0}
                    />
                    <QuizQ
                      q="If a = 23, b = 5, then q and r are:"
                      options={["q=5, r=2", "q=4, r=3", "q=3, r=4", "q=4, r=2"]}
                      correct={1}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Solved Examples */}
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold">Solved examples in this topic</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Watch the AI walk through every example in 5 steps.
              </p>
              <div className="mt-4 space-y-3">
                {topic.examples.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-start sm:p-5"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                        ex.watched ? "bg-success/15 text-success" : "bg-primary/10 text-primary",
                      )}
                    >
                      {ex.watched ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground">{ex.title}</div>
                      <div className="font-medium">{ex.problem}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {["Understand", "Concept", "Solve", "Mistakes", "Alt method"].map(
                          (s, i) => (
                            <span key={s} className="rounded-full bg-secondary px-2 py-0.5">
                              {i + 1}. {s}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={ex.watched ? "outline" : "default"}
                      className="self-start sm:self-center"
                    >
                      {ex.watched ? "Rewatch" : "Watch"}
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-accent" />
                You're 80% through this topic.
              </div>
              <Button
                asChild
                className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Link to="/chapters/$chapterId" params={{ chapterId: chapter.id }}>
                  Next topic <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-hero shadow-glow">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-display font-semibold">Ms. Nova</div>
                  <div className="text-xs text-muted-foreground">AI Teacher · Avatar</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                "Ask me anything about this topic. I'll re-explain, draw a different diagram, or
                give you another example."
              </p>
              <Button variant="outline" className="mt-4 w-full">
                Ask a doubt
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Chapter outline
              </h3>
              <ul className="mt-3 space-y-1">
                {chapter.topics.map((t, i) => (
                  <li key={t.id}>
                    <Link
                      to="/lesson/$topicId"
                      params={{ topicId: t.id }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        t.id === topic.id
                          ? "bg-secondary font-semibold text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60",
                      )}
                    >
                      <span className="text-xs">
                        {chapter.number}.{i + 1}
                      </span>
                      <span className="truncate">{t.title}</span>
                      {t.completed && <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-success" />}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-border pt-4">
                <Link
                  to="/chapters/$chapterId"
                  params={{ chapterId: chapter.id }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary/5"
                >
                  <BookOpen className="h-4 w-4" />
                  Go to exercises
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function QuizQ({ q, options, correct }: { q: string; options: string[]; correct: number }) {
  const [pick, setPick] = useState<number | null>(null);
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-sm font-medium">{q}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((opt, i) => {
          const state =
            pick === null ? "idle" : i === correct ? "correct" : pick === i ? "wrong" : "idle";
          return (
            <button
              key={opt}
              onClick={() => setPick(i)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                state === "idle" && "border-border hover:bg-secondary",
                state === "correct" && "border-success bg-success/10 text-success",
                state === "wrong" && "border-destructive bg-destructive/10 text-destructive",
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
