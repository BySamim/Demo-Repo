import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileImage,
  FileText,
  RotateCcw,
  Search,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type OcrStatus = "Pending" | "Completed" | "Failed";
type EvaluationStatus = "Queued" | "Evaluating" | "Needs review" | "Completed";
type ReviewDecision = "Unreviewed" | "Approved" | "Returned" | "Reprocess OCR";

type SubmissionRecord = {
  id: string;
  student: string;
  exercise: string;
  uploadedAt: string;
  fileName: string;
  fileType: "PDF" | "JPG" | "PNG";
  ocrStatus: OcrStatus;
  evaluationStatus: EvaluationStatus;
  confidence: number;
  score: number | null;
  extractedAnswers: string[];
  aiFeedback: Array<{ question: string; feedback: string; score: number | null }>;
};

const allValue = "all";

const initialSubmissions: SubmissionRecord[] = [
  {
    id: "sub-aarav-13",
    student: "Aarav Sharma",
    exercise: "Exercise 1.3",
    uploadedAt: "2 min ago",
    fileName: "aarav_ex_1_3.pdf",
    fileType: "PDF",
    ocrStatus: "Completed",
    evaluationStatus: "Evaluating",
    confidence: 82,
    score: null,
    extractedAnswers: [
      "Q1: HCF(455, 42) = 7 using Euclid's algorithm.",
      "Q2: Prime factors listed as 2 x 3 x 7 with one unclear coefficient.",
      "Q3: Decimal expansion check started; final justification missing.",
    ],
    aiFeedback: [
      { question: "Q1", feedback: "Method is clear and final answer is correct.", score: 100 },
      { question: "Q2", feedback: "One multiplication step is low confidence.", score: 70 },
      { question: "Q3", feedback: "Evaluation still running.", score: null },
    ],
  },
  {
    id: "sub-mira-22",
    student: "Mira Kapoor",
    exercise: "Exercise 2.2",
    uploadedAt: "11 min ago",
    fileName: "mira_zeroes_coefficients.jpg",
    fileType: "JPG",
    ocrStatus: "Completed",
    evaluationStatus: "Needs review",
    confidence: 54,
    score: 58,
    extractedAnswers: [
      "Q1: Sum of zeroes = -b/a.",
      "Q2: Product of zeroes = c/a, but signs are inconsistent.",
      "Q3: Graph interpretation partly unreadable near final answer.",
    ],
    aiFeedback: [
      { question: "Q1", feedback: "Formula correct, substitution correct.", score: 100 },
      { question: "Q2", feedback: "Likely sign error; needs manual confirmation.", score: 40 },
      { question: "Q3", feedback: "Low OCR confidence on graph labels.", score: 35 },
    ],
  },
  {
    id: "sub-kabir-12",
    student: "Kabir Mehta",
    exercise: "Exercise 1.2",
    uploadedAt: "24 min ago",
    fileName: "kabir_prime_factorization.pdf",
    fileType: "PDF",
    ocrStatus: "Completed",
    evaluationStatus: "Completed",
    confidence: 96,
    score: 86,
    extractedAnswers: [
      "Q1: LCM and HCF by prime factorization are complete.",
      "Q2: Proof steps are valid with minor presentation issue.",
    ],
    aiFeedback: [
      { question: "Q1", feedback: "Correct and well structured.", score: 100 },
      {
        question: "Q2",
        feedback: "Final claim correct; one justification could be clearer.",
        score: 72,
      },
    ],
  },
  {
    id: "sub-anika-31",
    student: "Anika Rao",
    exercise: "Exercise 3.1",
    uploadedAt: "38 min ago",
    fileName: "anika_linear_equations.png",
    fileType: "PNG",
    ocrStatus: "Failed",
    evaluationStatus: "Queued",
    confidence: 18,
    score: null,
    extractedAnswers: ["OCR failed: image is too dark and graph labels are blurred."],
    aiFeedback: [
      {
        question: "Upload",
        feedback: "Ask student to resubmit a brighter image or route to manual transcription.",
        score: null,
      },
    ],
  },
  {
    id: "sub-dev-41",
    student: "Dev Iyer",
    exercise: "Exercise 4.1",
    uploadedAt: "1 hr ago",
    fileName: "dev_quadratic_roots.pdf",
    fileType: "PDF",
    ocrStatus: "Pending",
    evaluationStatus: "Queued",
    confidence: 0,
    score: null,
    extractedAnswers: ["Waiting for OCR extraction."],
    aiFeedback: [
      {
        question: "Queue",
        feedback: "Evaluation starts after OCR completes.",
        score: null,
      },
    ],
  },
];

export function SubmissionReviewQueue() {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedId, setSelectedId] = useState(initialSubmissions[0].id);
  const [query, setQuery] = useState("");
  const [ocrFilter, setOcrFilter] = useState(allValue);
  const [evaluationFilter, setEvaluationFilter] = useState(allValue);
  const [reviewNotes, setReviewNotes] = useState(
    "Manual review note: verify low-confidence steps before releasing feedback.",
  );
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>({});

  const filteredSubmissions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesQuery =
        submission.student.toLowerCase().includes(normalizedQuery) ||
        submission.exercise.toLowerCase().includes(normalizedQuery) ||
        submission.fileName.toLowerCase().includes(normalizedQuery);
      const matchesOcr = ocrFilter === allValue || submission.ocrStatus === ocrFilter;
      const matchesEvaluation =
        evaluationFilter === allValue || submission.evaluationStatus === evaluationFilter;

      return matchesQuery && matchesOcr && matchesEvaluation;
    });
  }, [evaluationFilter, ocrFilter, query, submissions]);

  const selectedSubmission =
    filteredSubmissions.find((submission) => submission.id === selectedId) ??
    filteredSubmissions[0];
  const needsManualReview =
    selectedSubmission?.evaluationStatus === "Needs review" ||
    selectedSubmission?.confidence < 70 ||
    selectedSubmission?.ocrStatus === "Failed";
  const decision = selectedSubmission
    ? (decisions[selectedSubmission.id] ?? "Unreviewed")
    : "Unreviewed";

  function updateSelectedSubmission(updater: (submission: SubmissionRecord) => SubmissionRecord) {
    if (!selectedSubmission) return;
    setSubmissions((current) =>
      current.map((submission) =>
        submission.id === selectedSubmission.id ? updater(submission) : submission,
      ),
    );
  }

  function approveFeedback() {
    if (!selectedSubmission) return;
    setDecisions((current) => ({ ...current, [selectedSubmission.id]: "Approved" }));
    updateSelectedSubmission((submission) => ({
      ...submission,
      evaluationStatus: "Completed",
      score: submission.score ?? 60,
      confidence: Math.max(submission.confidence, 80),
    }));
  }

  function returnToStudent() {
    if (!selectedSubmission) return;
    setDecisions((current) => ({ ...current, [selectedSubmission.id]: "Returned" }));
  }

  function reprocessOcr() {
    if (!selectedSubmission) return;
    setDecisions((current) => ({ ...current, [selectedSubmission.id]: "Reprocess OCR" }));
    updateSelectedSubmission((submission) => ({
      ...submission,
      ocrStatus: "Pending",
      evaluationStatus: "Queued",
      confidence: 0,
      score: null,
    }));
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Submission review queue
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold">Answer sheet review</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Track uploaded answer sheets through OCR, AI evaluation, and manual review before
            releasing feedback to students.
          </p>
        </div>
        <div className="grid gap-2 text-center sm:min-w-80 sm:grid-cols-3">
          <SummaryTile label="Uploads" value={String(submissions.length)} />
          <SummaryTile
            label="Review"
            value={String(submissions.filter((submission) => submission.confidence < 70).length)}
          />
          <SummaryTile
            label="OCR failed"
            value={String(
              submissions.filter((submission) => submission.ocrStatus === "Failed").length,
            )}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search student, exercise, or file"
            className="pl-9"
          />
        </div>
        <Select value={ocrFilter} onValueChange={setOcrFilter}>
          <SelectTrigger>
            <SelectValue placeholder="OCR status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>All OCR statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={evaluationFilter} onValueChange={setEvaluationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Evaluation status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allValue}>All evaluations</SelectItem>
            <SelectItem value="Queued">Queued</SelectItem>
            <SelectItem value="Evaluating">Evaluating</SelectItem>
            <SelectItem value="Needs review">Needs review</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(24rem,1.15fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.1fr_0.75fr_0.75fr_0.6fr] bg-secondary/60 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid">
            <span>Upload</span>
            <span>OCR</span>
            <span>AI Eval</span>
            <span>Confidence</span>
          </div>
          <div className="divide-y divide-border">
            {filteredSubmissions.map((submission) => {
              const selected = submission.id === selectedSubmission?.id;
              return (
                <button
                  key={submission.id}
                  onClick={() => setSelectedId(submission.id)}
                  className={cn(
                    "grid w-full gap-3 px-4 py-4 text-left transition-colors lg:grid-cols-[1.1fr_0.75fr_0.75fr_0.6fr] lg:items-center",
                    selected ? "bg-primary/5" : "hover:bg-secondary/40",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="min-w-0 break-words font-medium">{submission.student}</span>
                      {submission.confidence < 70 && (
                        <Badge variant="outline" className="border-warning/40 text-warning">
                          Low confidence
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 break-words text-xs text-muted-foreground">
                      {submission.exercise} · {submission.uploadedAt}
                    </div>
                  </div>
                  <StatusBadge status={submission.ocrStatus} />
                  <StatusBadge status={submission.evaluationStatus} />
                  <div>
                    <div className="font-display text-xl font-bold">{submission.confidence}%</div>
                    <Progress value={submission.confidence} className="mt-2 h-1.5" />
                  </div>
                </button>
              );
            })}
            {filteredSubmissions.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No submissions match these filters.
              </div>
            )}
          </div>
        </div>

        {selectedSubmission ? (
          <SubmissionDetail
            submission={selectedSubmission}
            needsManualReview={needsManualReview}
            decision={decision}
            reviewNotes={reviewNotes}
            onReviewNotesChange={setReviewNotes}
            onApprove={approveFeedback}
            onReturn={returnToStudent}
            onReprocess={reprocessOcr}
          />
        ) : (
          <EmptySubmissionDetail />
        )}
      </div>
    </section>
  );
}

function SubmissionDetail({
  submission,
  needsManualReview,
  decision,
  reviewNotes,
  onReviewNotesChange,
  onApprove,
  onReturn,
  onReprocess,
}: {
  submission: SubmissionRecord;
  needsManualReview: boolean;
  decision: ReviewDecision;
  reviewNotes: string;
  onReviewNotesChange: (value: string) => void;
  onApprove: () => void;
  onReturn: () => void;
  onReprocess: () => void;
}) {
  return (
    <aside className="min-w-0 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-words font-display text-lg font-semibold">
              {submission.student}
            </h3>
            <StatusBadge status={submission.evaluationStatus} />
          </div>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {submission.exercise} · {submission.fileName}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="font-display text-3xl font-bold">
            {submission.score === null ? "--" : `${submission.score}%`}
          </div>
          <div className="text-xs text-muted-foreground">Current score</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <DetailMetric label="OCR" value={submission.ocrStatus} />
        <DetailMetric label="AI Eval" value={submission.evaluationStatus} />
        <DetailMetric label="Review" value={decision} />
      </div>

      {needsManualReview && (
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-warning">
            <AlertTriangle className="h-4 w-4" />
            Manual review required
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Low confidence, OCR failure, or AI uncertainty needs admin confirmation.
          </p>
        </div>
      )}

      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-3">
        <ReviewPane title="Original upload" icon={FileImage}>
          <div className="flex min-h-64 min-w-0 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40 p-5 text-center">
            <FileText className="h-12 w-12 shrink-0 text-primary" />
            <div className="mt-3 w-full max-w-full break-all text-sm font-medium leading-relaxed">
              {submission.fileName}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {submission.fileType} answer sheet
            </div>
            <Button variant="outline" size="sm" className="mt-4">
              <Eye className="h-4 w-4" />
              Open preview
            </Button>
          </div>
        </ReviewPane>

        <ReviewPane title="Extracted answers" icon={FileText}>
          <div className="space-y-2">
            {submission.extractedAnswers.map((answer) => (
              <div key={answer} className="rounded-lg bg-secondary/50 p-3 text-sm">
                {answer}
              </div>
            ))}
          </div>
        </ReviewPane>

        <ReviewPane title="AI feedback" icon={Sparkles}>
          <div className="space-y-2">
            {submission.aiFeedback.map((item) => (
              <div
                key={`${item.question}-${item.feedback}`}
                className="rounded-lg border border-border p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 break-words font-medium">{item.question}</div>
                  <div className="shrink-0 text-sm font-semibold">
                    {item.score === null ? "Pending" : `${item.score}%`}
                  </div>
                </div>
                <p className="mt-1 break-words text-sm text-muted-foreground">{item.feedback}</p>
              </div>
            ))}
          </div>
        </ReviewPane>
      </div>

      <div className="mt-5 rounded-xl border border-border p-4">
        <h4 className="font-display text-base font-semibold">Manual review workflow</h4>
        <Textarea
          value={reviewNotes}
          onChange={(event) => onReviewNotesChange(event.target.value)}
          className="mt-3 min-h-24"
        />
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button onClick={onApprove} className="w-full sm:w-auto">
            <CheckCircle2 className="h-4 w-4" />
            Approve feedback
          </Button>
          <Button variant="outline" onClick={onReturn} className="w-full sm:w-auto">
            <XCircle className="h-4 w-4" />
            Return to student
          </Button>
          <Button variant="outline" onClick={onReprocess} className="w-full sm:w-auto">
            <RotateCcw className="h-4 w-4" />
            Reprocess OCR
          </Button>
        </div>
      </div>
    </aside>
  );
}

function StatusBadge({ status }: { status: OcrStatus | EvaluationStatus }) {
  const className =
    status === "Completed"
      ? "border-success/40 text-success"
      : status === "Failed"
        ? "border-destructive/40 text-destructive"
        : status === "Needs review"
          ? "border-warning/40 text-warning"
          : "border-primary/40 text-primary";

  return (
    <Badge variant="outline" className={className}>
      {status}
    </Badge>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-secondary/50 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-semibold">{value}</div>
    </div>
  );
}

function ReviewPane({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border p-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </div>
      {children}
    </div>
  );
}

function EmptySubmissionDetail() {
  return (
    <aside className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
      <div>
        <Search className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-3 font-display text-lg font-semibold">No submission selected</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the filters to find an answer sheet.
        </p>
      </div>
    </aside>
  );
}
