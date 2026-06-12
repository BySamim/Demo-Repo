import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
  Sparkles,
  Camera,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit Answers · SharmaAI" },
      {
        name: "description",
        content: "Upload your solved exercise as PDF, JPG or PNG and get AI evaluation in minutes.",
      },
    ],
  }),
  component: Submit,
});

type Stage = "idle" | "uploading" | "evaluating" | "done";

function Submit() {
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [stage, setStage] = useState<Stage>("idle");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(0)} KB`,
    }));
    setFiles((p) => [...p, ...items]);
  };

  const startEval = () => {
    setStage("uploading");
    setTimeout(() => setStage("evaluating"), 800);
    setTimeout(() => setStage("done"), 2400);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div>
          <p className="text-sm text-muted-foreground">Exercise 1.3 · Chapter 1 Real Numbers</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Submit your solutions
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Upload a clear photo or scan of your handwritten work. Our AI reads each step, not just
            the final answer.
          </p>
        </div>

        {stage !== "done" ? (
          <>
            <div
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className="mt-8 rounded-2xl border-2 border-dashed border-border bg-card p-5 text-center transition-colors hover:border-primary/50 sm:rounded-3xl sm:p-12"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold">Drag & drop your files</h2>
              <p className="mt-1 text-sm text-muted-foreground">PDF, JPG or PNG · up to 50 MB</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  onClick={() =>
                    setFiles((p) => [...p, { name: `Ex1.3_attempt.pdf`, size: "1.2 MB" }])
                  }
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Choose file
                </Button>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" />
                  Use phone camera
                </Button>
                <Button variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Send by email
                </Button>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Attached files
                </h3>
                <ul className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                        {f.name.endsWith(".pdf") ? (
                          <FileText className="h-5 w-5" />
                        ) : (
                          <ImageIcon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{f.name}</div>
                        <div className="text-xs text-muted-foreground">{f.size}</div>
                      </div>
                      <button
                        onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-stretch sm:justify-end">
                  <Button
                    onClick={startEval}
                    disabled={stage !== "idle"}
                    className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95"
                  >
                    {stage === "idle" && (
                      <>
                        Submit for AI evaluation <Sparkles className="ml-2 h-4 w-4" />
                      </>
                    )}
                    {stage === "uploading" && "Uploading..."}
                    {stage === "evaluating" && "AI is evaluating..."}
                  </Button>
                </div>
              </div>
            )}

            {/* Pipeline visual */}
            <div className="mt-10 grid gap-4 md:grid-cols-5">
              {[
                ["OCR Extraction", "MathPix reads your handwriting"],
                ["Question Segmentation", "Q1, Q2, Q3 identified"],
                ["Step Capture", "Each math step parsed"],
                ["Math Verification", "Steps checked, not just answers"],
                ["Score & Feedback", "Question-wise + remediation"],
              ].map(([t, d], i) => (
                <div
                  key={t}
                  className={cn(
                    "rounded-2xl border border-border bg-card p-4 shadow-soft transition-opacity",
                    stage === "evaluating" && i <= 2 && "ring-1 ring-primary",
                  )}
                >
                  <div className="text-xs font-mono text-muted-foreground">Step {i + 1}</div>
                  <div className="mt-1 font-display text-sm font-semibold">{t}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Result />
        )}
      </main>
    </div>
  );
}

function Result() {
  const questions = [
    {
      id: "Q1",
      verdict: "correct",
      score: 100,
      note: "Method and answer correct. Clean presentation.",
    },
    {
      id: "Q2",
      verdict: "partial",
      score: 70,
      note: "Right approach, arithmetic slip in step 3 (6×7=42, not 48).",
    },
    { id: "Q3", verdict: "correct", score: 100, note: "Excellent use of prime factorization." },
    {
      id: "Q4",
      verdict: "wrong",
      score: 0,
      note: "Wrong concept — used HCF formula instead of LCM.",
    },
    {
      id: "Q5",
      verdict: "partial",
      score: 70,
      note: "Final answer correct but missing justification step.",
    },
  ];
  const total = Math.round(questions.reduce((s, q) => s + q.score, 0) / questions.length);
  const passed = total >= 60;

  return (
    <div className="mt-8 space-y-6">
      <div
        className={cn(
          "overflow-hidden rounded-3xl p-8 shadow-glow",
          passed
            ? "bg-gradient-to-br from-success to-[oklch(0.6_0.16_180)] text-success-foreground"
            : "bg-gradient-to-br from-destructive to-accent text-destructive-foreground",
        )}
      >
        <div className="text-xs uppercase tracking-widest opacity-80">Evaluation complete</div>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
          <div className="font-display text-6xl font-bold sm:text-7xl">{total}%</div>
          <div className="sm:pb-2">
            <div className="font-display text-2xl font-semibold">
              {passed ? "Mastered ✓" : "Needs more practice"}
            </div>
            <div className="text-sm opacity-80">
              {passed
                ? "Next exercise unlocked."
                : "Threshold is 60%. Try the remediation plan below."}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold">Per-question breakdown</h3>
        <ul className="mt-4 space-y-3">
          {questions.map((q) => (
            <li key={q.id} className="rounded-xl border border-border p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg font-display font-bold",
                    q.verdict === "correct" && "bg-success/15 text-success",
                    q.verdict === "partial" && "bg-warning/15 text-warning",
                    q.verdict === "wrong" && "bg-destructive/15 text-destructive",
                  )}
                >
                  {q.id}
                </span>
                <div className="flex-1">
                  <div className="text-sm">{q.note}</div>
                </div>
                <div className="shrink-0 font-display text-xl font-bold">{q.score}%</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {!passed && (
        <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary">
            <Sparkles className="h-4 w-4" />
            Remediation plan
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold">Let's fix the weak areas</h3>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Replay: Topic 1.2 · Fundamental Theorem of Arithmetic",
              "Rewatch: Example 4 · Proof that √2 is irrational",
              "Practice: 10 generated questions on LCM vs HCF",
              "Resubmit Exercise 1.3 after practice",
            ].map((s) => (
              <li key={s} className="flex items-start gap-2 rounded-xl bg-background p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button className="bg-gradient-hero text-primary-foreground shadow-glow hover:opacity-95">
              Start remediation
            </Button>
            <Button variant="outline">Retry later</Button>
          </div>
        </div>
      )}
    </div>
  );
}
