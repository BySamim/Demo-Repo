import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { chapters } from "@/lib/mock-data";
import { ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/chapters/")({
  head: () => ({
    meta: [
      { title: "Chapters · SharmaAI" },
      {
        name: "description",
        content: "Browse every chapter of R.D. Sharma Class X Mathematics and track your progress.",
      },
    ],
  }),
  component: ChaptersList,
});

function ChaptersList() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">R.D. Sharma · CBSE Class X</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Chapters
            </h1>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Pick any chapter to start. Topics, solved examples and exercises are unlocked
              progressively as you demonstrate mastery.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((c) => (
            <Link
              key={c.id}
              to="/chapters/$chapterId"
              params={{ chapterId: c.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute right-4 top-4 font-display text-6xl font-bold text-muted/40">
                {String(c.number).padStart(2, "0")}
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  Chapter {c.number}
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold">{c.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{c.progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-hero"
                      style={{ width: `${c.progress}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.exercises.length} exercises</span>
                  <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
