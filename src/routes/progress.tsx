import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { chapters, studentProfile } from "@/lib/mock-data";
import { Award, Brain, Clock, Flame, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress · SharmaAI" },
      {
        name: "description",
        content: "Track accuracy, speed, strong concepts and weak concepts across every chapter.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">My progress</h1>
        <p className="mt-2 text-muted-foreground">
          Your adaptive learning profile, built from every exercise you've submitted.
        </p>

        {/* Learning score */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl bg-gradient-board p-5 text-white shadow-glow sm:rounded-3xl sm:p-8">
            <div className="text-xs uppercase tracking-widest text-white/60">Learning Score</div>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-6xl font-bold sm:text-7xl">
                {studentProfile.learningScore}
              </span>
              <span className="pb-3 text-white/60">/ 100</span>
            </div>
            <p className="mt-2 max-w-md text-sm text-white/70">
              You're learning faster than 72% of CBSE Class X students at this chapter range.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Tile icon={Target} label="Accuracy" value="84%" />
              <Tile icon={Clock} label="Avg time / Q" value="2.4 min" />
              <Tile icon={Flame} label="Streak" value={`${studentProfile.streak}d`} />
              <Tile icon={Award} label="Certificates" value="2" />
            </div>
          </div>

          <div className="grid grid-rows-2 gap-6">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-4 w-4 text-success" />
                Strong concepts
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {["Euclid's Algorithm", "Prime Factorization", "Zeroes of Polynomials"].map((s) => (
                  <li
                    key={s}
                    className="flex items-start justify-between gap-3 rounded-lg bg-success/10 px-3 py-2"
                  >
                    <span className="min-w-0">{s}</span>
                    <span className="shrink-0 font-semibold text-success">94%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Brain className="h-4 w-4 text-warning" />
                Weak concepts
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  ["LCM vs HCF mixing", 52],
                  ["Irrational proofs", 48],
                  ["Decimal expansions", 58],
                ].map(([s, v]) => (
                  <li
                    key={String(s)}
                    className="flex items-start justify-between gap-3 rounded-lg bg-warning/10 px-3 py-2"
                  >
                    <span className="min-w-0">{s}</span>
                    <span className="shrink-0 font-semibold text-warning">{v}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Chapter progress bars */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Chapter mastery</h2>
          <div className="mt-4 space-y-3">
            {chapters.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Chapter {c.number}</div>
                    <div className="font-display text-base font-semibold">{c.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-2xl font-bold">{c.progress}%</div>
                    <div className="text-xs text-muted-foreground">
                      {c.exercises.filter((e) => e.status === "completed").length}/
                      {c.exercises.length} exercises
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-hero"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <Icon className="h-4 w-4 text-accent" />
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
