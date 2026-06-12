import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { getChapter, type Chapter, type Exercise } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Download,
  FileText,
  Lock,
  PlayCircle,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chapters/$chapterId")({
  head: ({ params }) => {
    const chapter = getChapter(params.chapterId);
    const title = chapter
      ? `Chapter ${chapter.number}: ${chapter.title} · SharmaAI`
      : "Chapter · SharmaAI";
    return {
      meta: [{ title }, { name: "description", content: chapter?.description ?? "Chapter detail" }],
    };
  },
  loader: ({ params }): { chapter: Chapter } => {
    const chapter = getChapter(params.chapterId);
    if (!chapter) throw notFound();
    return { chapter };
  },
  component: ChapterDetail,
  notFoundComponent: () => <div className="p-6 sm:p-10">Chapter not found.</div>,
  errorComponent: ({ error }) => (
    <div className="p-6 text-destructive sm:p-10">{error.message}</div>
  ),
});

function ChapterDetail() {
  const { chapter } = Route.useLoaderData() as { chapter: Chapter };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <Link
          to="/chapters"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to chapters
        </Link>

        {/* Header */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-board p-5 text-white shadow-glow sm:rounded-3xl sm:p-10">
          <div className="grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/60">
                Chapter {chapter.number}
              </div>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                {chapter.title}
              </h1>
              <p className="mt-3 max-w-2xl text-white/70">{chapter.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {chapter.topics[0] && (
                  <Button asChild className="bg-white text-foreground hover:bg-white/90">
                    <Link to="/lesson/$topicId" params={{ topicId: chapter.topics[0].id }}>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Watch first topic
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download chapter PDF
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Mastery progress</span>
                <span>{chapter.progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-primary-glow"
                  style={{ width: `${chapter.progress}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <Mini label="Topics" value={String(chapter.topics.length)} />
                <Mini
                  label="Examples"
                  value={String(chapter.topics.reduce((n, t) => n + t.examples.length, 0))}
                />
                <Mini label="Exercises" value={String(chapter.exercises.length)} />
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <section className="mt-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-2xl font-bold">Topics</h2>
            <span className="text-sm text-muted-foreground">
              {chapter.topics.filter((t) => t.completed).length} of {chapter.topics.length} complete
            </span>
          </div>
          {chapter.topics.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground sm:p-10">
              Topics for this chapter are being prepared by the AI.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {chapter.topics.map((t, idx) => (
                <Link
                  key={t.id}
                  to="/lesson/$topicId"
                  params={{ topicId: t.id }}
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow sm:flex-row sm:items-center sm:p-5"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-display font-bold",
                      t.completed
                        ? "bg-success/15 text-success"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {t.completed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">
                      Topic {chapter.number}.{idx + 1} · {t.duration}
                    </div>
                    <div className="font-display text-lg font-semibold">{t.title}</div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{t.summary}</p>
                  </div>
                  <div className="hidden text-xs text-muted-foreground sm:block">
                    {t.examples.length} solved examples
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="self-start text-primary group-hover:bg-primary/10 sm:self-center"
                  >
                    <PlayCircle className="mr-1 h-4 w-4" />
                    Watch
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Exercises */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold">Exercises</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach 60% on an exercise to unlock the next one.
          </p>
          {chapter.exercises.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border p-6 text-center text-muted-foreground sm:p-10">
              No exercises published yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {chapter.exercises.map((e) => (
                <ExerciseCard key={e.id} ex={e} chapterNumber={chapter.number} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}

function ExerciseCard({ ex, chapterNumber }: { ex: Exercise; chapterNumber: number }) {
  const statusMap = {
    completed: { label: "Completed", icon: CheckCircle2, className: "bg-success/15 text-success" },
    in_progress: { label: "In progress", icon: Circle, className: "bg-warning/15 text-warning" },
    available: { label: "Available", icon: BookOpen, className: "bg-primary/10 text-primary" },
    locked: { label: "Locked", icon: Lock, className: "bg-muted text-muted-foreground" },
  } as const;
  const s = statusMap[ex.status];
  const locked = ex.status === "locked";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-soft",
        locked && "opacity-60",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">Exercise {ex.number}</div>
          <div className="mt-1 font-display text-lg font-semibold">{ex.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">{ex.questionCount} questions</div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            s.className,
          )}
        >
          <s.icon className="h-3 w-3" />
          {s.label}
        </span>
      </div>
      {ex.score !== undefined && (
        <div className="mt-4 rounded-xl bg-secondary/50 p-3">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Last score</span>
            <span className="font-semibold text-success">{ex.score}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
            <div className="h-full rounded-full bg-success" style={{ width: `${ex.score}%` }} />
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button size="sm" variant="outline" disabled={locked}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          PDF (Ch{String(chapterNumber).padStart(2, "0")}_Ex{ex.number.replace(".", "")}.pdf)
        </Button>
        <Button size="sm" disabled={locked} asChild={!locked}>
          {locked ? (
            <span>
              <Lock className="mr-1.5 h-3.5 w-3.5" />
              Locked
            </span>
          ) : (
            <Link to="/submit">
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Submit
            </Link>
          )}
        </Button>
        {!locked && (
          <Button size="sm" variant="ghost">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Solve online
          </Button>
        )}
      </div>
      {locked && (
        <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          Unlock by completing the previous exercise with ≥ 60%.
        </p>
      )}
    </div>
  );
}
