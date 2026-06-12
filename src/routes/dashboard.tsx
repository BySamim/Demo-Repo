import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { chapters, studentProfile } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Flame,
  TrendingUp,
  BookOpen,
  Clock,
  PlayCircle,
  Upload,
  Bell,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · SharmaAI" },
      {
        name: "description",
        content:
          "Your current chapter, pending exercises, scores and recommended revision in one view.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const current = chapters[0];
  const pending = chapters.flatMap((c) =>
    c.exercises.filter((e) => e.status === "in_progress").map((e) => ({ ...e, chapter: c })),
  );
  const completed = chapters.flatMap((c) =>
    c.exercises.filter((e) => e.status === "completed").map((e) => ({ ...e, chapter: c })),
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Welcome */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {studentProfile.name} 👋
            </h1>
            <p className="mt-2 text-muted-foreground">
              You're {studentProfile.streak} days into your streak. Let's keep it going.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button
              asChild
              className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
            >
              <Link to="/chapters/$chapterId" params={{ chapterId: current.id }}>
                Resume learning <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={TrendingUp}
            label="Learning Score"
            value={`${studentProfile.learningScore}/100`}
            accent="primary"
          />
          <StatCard
            icon={Flame}
            label="Day Streak"
            value={`${studentProfile.streak} days`}
            accent="accent"
          />
          <StatCard
            icon={BookOpen}
            label="Average Score"
            value={`${studentProfile.averageScore}%`}
            accent="success"
          />
          <StatCard
            icon={Clock}
            label="Hours Learned"
            value={`${studentProfile.hoursLearned}h`}
            accent="primary"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Continue Learning */}
          <div className="rounded-2xl bg-gradient-board p-5 text-white shadow-glow sm:p-8 lg:col-span-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Continue learning
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
              Chapter {current.number}: {current.title}
            </h2>
            <p className="mt-2 max-w-xl text-white/70">{current.description}</p>
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Chapter progress</span>
                <span>{current.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-primary-glow"
                  style={{ width: `${current.progress}%` }}
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild className="bg-white text-foreground hover:bg-white/90">
                <Link to="/chapters/$chapterId" params={{ chapterId: current.id }}>
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Continue chapter
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload answers
                </Link>
              </Button>
            </div>
          </div>

          {/* Recommended */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Recommended revision</h3>
            <p className="mt-1 text-sm text-muted-foreground">Based on your last attempts.</p>
            <ul className="mt-4 space-y-3">
              {[
                {
                  topic: "Topic 1.2 · Prime Factorization",
                  reason: "Missed 2 questions in Ex 1.2",
                },
                { topic: "Example 4 · √2 is irrational", reason: "Not watched yet" },
                { topic: "Topic 2.2 · Zeroes & Coefficients", reason: "Score below 70%" },
              ].map((r) => (
                <li
                  key={r.topic}
                  className="rounded-xl border border-border p-3 transition-colors hover:bg-secondary/60"
                >
                  <div className="text-sm font-medium">{r.topic}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{r.reason}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Two columns */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">Pending exercises</h3>
              <Link to="/chapters" className="text-xs font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {pending.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Ch {p.chapter.number} · Ex {p.number}
                    </div>
                    <div className="text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {p.questionCount} questions
                    </div>
                  </div>
                  <Button size="sm" asChild className="sm:self-center">
                    <Link to="/chapters/$chapterId" params={{ chapterId: p.chapter.id }}>
                      Continue
                    </Link>
                  </Button>
                </li>
              ))}
              {pending.length === 0 && (
                <li className="text-sm text-muted-foreground">All caught up.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Recent scores</h3>
            <ul className="mt-4 space-y-3">
              {completed.slice(0, 4).map((c) => (
                <li key={c.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Ch {c.chapter.number} · Ex {c.number}
                      </div>
                      <div className="text-sm font-semibold">{c.title}</div>
                    </div>
                    <div className="font-display text-2xl font-bold text-success">{c.score}%</div>
                  </div>
                  <Progress value={c.score} className="mt-3 h-1.5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: "primary" | "accent" | "success";
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/15 text-accent-foreground",
    success: "bg-success/15 text-success",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
