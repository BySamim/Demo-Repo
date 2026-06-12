import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  FileText,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";

import { ContentManagement } from "@/features/admin/content-management";
import { StudentManagement } from "@/features/admin/student-management";
import { SubmissionReviewQueue } from "@/features/admin/submission-review-queue";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { chapters } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const totalTopics = chapters.reduce((sum, chapter) => sum + chapter.topics.length, 0);
  const totalExercises = chapters.reduce((sum, chapter) => sum + chapter.exercises.length, 0);
  const completedExercises = chapters.reduce(
    (sum, chapter) =>
      sum + chapter.exercises.filter((exercise) => exercise.status === "completed").length,
    0,
  );
  const averageMastery = Math.round(
    chapters.reduce((sum, chapter) => sum + chapter.progress, 0) / chapters.length,
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-7xl overflow-hidden px-3 py-6 sm:px-6 sm:py-10">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Admin console
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Learning operations
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Track student health, AI evaluation flow and chapter readiness from one control
              surface.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="h-4 w-4" />
              Export report
            </Button>
            <Button className="w-full bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95 sm:w-auto">
              <Sparkles className="h-4 w-4" />
              Generate content
            </Button>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            label="Active learners"
            value="248"
            detail="+18 this week"
            tone="primary"
          />
          <MetricCard
            icon={BookOpen}
            label="Topics live"
            value={String(totalTopics)}
            detail={`${chapters.length} chapters`}
            tone="success"
          />
          <MetricCard
            icon={Upload}
            label="Exercise submissions"
            value="1,426"
            detail={`${completedExercises}/${totalExercises} demo complete`}
            tone="accent"
          />
          <MetricCard
            icon={TrendingUp}
            label="Avg mastery"
            value={`${averageMastery}%`}
            detail="Across chapters"
            tone="primary"
          />
        </section>

        <StudentManagement />

        <ContentManagement />

        <SubmissionReviewQueue />

        <section className="mt-6">
          <div className="rounded-2xl bg-gradient-board p-5 text-white shadow-glow sm:p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
              <BarChart3 className="h-4 w-4 text-accent" />
              Platform pulse
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PulseTile label="AI eval SLA" value="94%" />
              <PulseTile label="OCR success" value="89%" />
              <PulseTile label="Voice jobs" value="31" />
              <PulseTile label="Flags open" value="7" />
            </div>
            <div className="mt-5 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Attention needed
              </div>
              <p className="mt-2 text-sm text-white/65">
                Chapter 3 has low content readiness and two learner cohorts below 60% mastery.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
  tone: "primary" | "success" | "accent";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-success",
    accent: "bg-accent/20 text-accent-foreground",
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneMap[tone])}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
    </div>
  );
}

function PulseTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
