import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Brain,
  FileCheck,
  GraduationCap,
  Mic,
  Eye,
  Award,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SharmaAI — AI Math Tutor for CBSE Class X" },
      {
        name: "description",
        content:
          "An AI-powered adaptive learning platform that teaches every chapter of R.D. Sharma Class X Mathematics, evaluates your solutions, and guides mastery.",
      },
      { property: "og:title", content: "SharmaAI — AI Math Tutor for CBSE Class X" },
      {
        property: "og:description",
        content:
          "Learn every R.D. Sharma chapter from an AI teacher. Upload solutions. Get instant evaluation and personalized remediation.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: GraduationCap,
    title: "AI Teacher Avatar",
    desc: "A human-like virtual teacher explains every chapter, topic and solved example with voice and animated whiteboard.",
  },
  {
    icon: FileCheck,
    title: "Instant Solution Evaluation",
    desc: "Upload handwritten answers. OCR + math-aware AI grades each step and gives question-level feedback.",
  },
  {
    icon: Brain,
    title: "Mastery-Based Progression",
    desc: "Unlock the next exercise only after demonstrating 60%+ competency. Built-in remediation when you miss the bar.",
  },
  {
    icon: Mic,
    title: "Bilingual Explanations",
    desc: "Switch between English and Hindi narration on any topic — learn the way you understand best.",
  },
  {
    icon: Eye,
    title: "Visual Math",
    desc: "Diagrams, geometry figures, number lines and graphs rendered alongside every concept.",
  },
  {
    icon: Award,
    title: "Adaptive Learning Score",
    desc: "Your profile tracks accuracy, speed and weak concepts to recommend the perfect next step.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">
              Sharma<span className="text-primary">AI</span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/dashboard">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/dashboard">Start learning</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-14 pt-28 sm:pb-20 md:pt-32 lg:pb-24">
        <div className="absolute inset-0 -z-10 bg-gradient-card" />
        <div className="absolute -top-24 right-0 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl sm:h-[480px] sm:w-[480px]" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl sm:h-[420px] sm:w-[420px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="min-w-0">
              <div className="hero-kicker px-3 py-1.5 text-[0.76rem] leading-none sm:text-[0.82rem]">
                <span className="insi-star">✦</span>
                <strong className="font-semibold text-muted-foreground">
                  Built on R.D. Sharma . CBSE Class X
                </strong>
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Your personal{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  AI math teacher
                </span>{" "}
                for every chapter.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
                Watch every topic explained on an animated board. Solve exercises, upload your
                answers, and get instant step-by-step evaluation — all the way through R.D. Sharma
                Class X.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
                >
                  <Link to="/dashboard">
                    Open my dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/chapters">Browse chapters</Link>
                </Button>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-5 text-sm sm:flex sm:flex-wrap sm:gap-8">
                <Stat value="15" label="Chapters" />
                <Stat value="120+" label="Topics" />
                <Stat value="800+" label="Solved examples" />
                <Stat value="60%" label="Mastery threshold" />
              </div>
            </div>

            {/* AI Teacher mock card */}
            <div className="relative min-w-0 max-w-full">
              <div className="relative w-full max-w-full overflow-hidden rounded-2xl bg-gradient-board p-3 shadow-glow sm:rounded-3xl sm:p-6">
                <div className="flex items-center justify-between gap-3 text-[10px] text-white/60 sm:text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    <span className="h-2 w-2 rounded-full bg-success" />
                  </div>
                  <span className="truncate font-mono">Topic 1.1 · Euclid's Lemma</span>
                </div>
                <div className="mt-3 flex min-h-[13rem] w-full max-w-full flex-col overflow-hidden rounded-xl bg-[oklch(0.18_0.04_265)] p-3 font-mono text-white/90 shadow-inner ring-1 ring-white/5 sm:mt-4 sm:aspect-video sm:min-h-0 sm:rounded-2xl sm:p-6">
                  <div className="truncate text-[11px] text-white/40 sm:text-xs">
                    // The Division Lemma
                  </div>
                  <div className="mt-3 text-xl sm:text-2xl">a = bq + r</div>
                  <div className="mt-1 text-xs text-white/60 sm:text-sm">where 0 ≤ r &lt; b</div>
                  <div className="mt-5 text-[11px] text-white/40 sm:mt-6 sm:text-xs">Example</div>
                  <div className="mt-2 break-words text-[11px] sm:text-base">
                    HCF(455, 42) → 455 = 42 × 10 + 35
                  </div>
                  <div className="text-[11px] sm:text-base">42 = 35 × 1 + 7</div>
                  <div className="text-[11px] sm:text-base">35 = 7 × 5 + 0</div>
                  <div className="mt-auto pt-2 text-[11px] text-accent sm:text-base">∴ HCF = 7</div>
                </div>
                <div className="mt-3 flex min-w-0 items-center gap-3 rounded-xl bg-white/5 p-3 text-white/80 ring-1 ring-white/10 sm:mt-4 sm:rounded-2xl">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-hero sm:h-10 sm:w-10">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">Ms. Nova · AI Teacher</div>
                    <div className="truncate text-xs text-white/50">
                      "Let's break this down step by step…"
                    </div>
                  </div>
                  <div className="hidden items-end gap-0.5 sm:flex">
                    {[8, 14, 22, 12, 18, 10, 16].map((h, i) => (
                      <span key={i} className="w-1 rounded-full bg-accent" style={{ height: h }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft ring-1 ring-border sm:absolute sm:-right-4 sm:-top-4 sm:mt-0">
                <Clock className="h-4 w-4 text-primary" />
                <div className="text-xs">
                  <div className="font-semibold">12 min lesson</div>
                  <div className="text-muted-foreground">Self-paced</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-soft ring-1 ring-border sm:absolute sm:-bottom-4 sm:-left-4 sm:mt-0">
                <Award className="h-4 w-4 text-success" />
                <div className="text-xs">
                  <div className="font-semibold">92% accuracy</div>
                  <div className="text-muted-foreground">Last exercise</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            A full classroom, rebuilt for one student.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Every R.D. Sharma chapter is broken into bite-size topics, taught by an AI avatar, and
            locked behind real assessments.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-card text-primary ring-1 ring-primary/10">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flow */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                How a chapter works
              </h2>
              <p className="mt-4 text-muted-foreground">
                A consistent loop, from concept to mastery. No skipping ahead until you've earned
                it.
              </p>
            </div>
            <ol className="space-y-4">
              {[
                ["Watch", "AI teacher explains the topic with voice + animated board."],
                ["Practice", "Step-by-step walkthrough of every solved example in the book."],
                ["Solve", "Download the exercise PDF or solve online at your own pace."],
                ["Submit", "Upload your handwritten or typed solutions in seconds."],
                ["Evaluate", "OCR + math-aware AI scores every step, not just the final answer."],
                [
                  "Progress",
                  "Hit 60%+ to unlock the next exercise. Otherwise, get targeted remediation.",
                ],
              ].map(([title, desc], i) => (
                <li
                  key={title}
                  className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:gap-4 sm:p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-hero font-display font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <div className="font-display text-base font-semibold">{title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl">
          Ready to learn Class X the smart way?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Jump into your dashboard and pick up where the AI teacher left off.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
          >
            <Link to="/dashboard">
              Open dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/chapters">Explore chapters</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © 2026 SharmaAI · Powered by AI for CBSE learners
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
