import { useMemo, useState, type ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  FileText,
  LifeBuoy,
  Search,
  Sparkles,
  Target,
  Users,
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
import { cn } from "@/lib/utils";

type RiskLevel = "On track" | "Needs help" | "Strong" | "At risk";

type StudentRecord = {
  id: string;
  name: string;
  grade: string;
  risk: RiskLevel;
  score: number;
  streak: number;
  currentChapter: string;
  currentExercise: string;
  progress: number;
  averageScore: number;
  weakConcepts: Array<{ concept: string; score: number }>;
  submissions: Array<{
    exercise: string;
    status: string;
    score: number | null;
    submittedAt: string;
  }>;
  activity: string[];
  recommendedRemediation: string;
};

const students: StudentRecord[] = [
  {
    id: "stu-aarav",
    name: "Aarav Sharma",
    grade: "Class X",
    risk: "On track",
    score: 78,
    streak: 12,
    currentChapter: "Real Numbers",
    currentExercise: "Exercise 1.3",
    progress: 90,
    averageScore: 84,
    weakConcepts: [
      { concept: "Irrational proofs", score: 48 },
      { concept: "Decimal expansions", score: 58 },
    ],
    submissions: [
      { exercise: "Exercise 1.3", status: "Evaluating", score: null, submittedAt: "2 min ago" },
      { exercise: "Exercise 1.2", status: "Completed", score: 78, submittedAt: "Yesterday" },
      { exercise: "Exercise 1.1", status: "Completed", score: 92, submittedAt: "3 days ago" },
    ],
    activity: [
      "Watched Euclid's Division Lemma",
      "Submitted Exercise 1.3",
      "Rewatched proof that square root 2 is irrational",
    ],
    recommendedRemediation: "Assign proof-writing practice and 10 decimal expansion checks.",
  },
  {
    id: "stu-mira",
    name: "Mira Kapoor",
    grade: "Class X",
    risk: "Needs help",
    score: 61,
    streak: 3,
    currentChapter: "Polynomials",
    currentExercise: "Exercise 2.2",
    progress: 56,
    averageScore: 66,
    weakConcepts: [
      { concept: "Zeroes and coefficients", score: 52 },
      { concept: "Graph interpretation", score: 49 },
    ],
    submissions: [
      { exercise: "Exercise 2.2", status: "Needs review", score: 58, submittedAt: "11 min ago" },
      { exercise: "Exercise 2.1", status: "Completed", score: 74, submittedAt: "2 days ago" },
    ],
    activity: [
      "Paused lesson at coefficient relationship",
      "Submitted Exercise 2.2",
      "Viewed remediation notes",
    ],
    recommendedRemediation: "Assign a guided coefficients worksheet and teacher review.",
  },
  {
    id: "stu-kabir",
    name: "Kabir Mehta",
    grade: "Class X",
    risk: "Strong",
    score: 84,
    streak: 18,
    currentChapter: "Real Numbers",
    currentExercise: "Exercise 1.2",
    progress: 94,
    averageScore: 88,
    weakConcepts: [
      { concept: "Presentation steps", score: 72 },
      { concept: "Long proof notation", score: 76 },
    ],
    submissions: [
      { exercise: "Exercise 1.2", status: "Completed", score: 86, submittedAt: "24 min ago" },
      { exercise: "Exercise 1.1", status: "Completed", score: 90, submittedAt: "4 days ago" },
    ],
    activity: [
      "Completed Prime Factorization",
      "Unlocked Exercise 1.3",
      "Maintained 18 day streak",
    ],
    recommendedRemediation: "Assign one proof-polish task before moving to new chapter.",
  },
  {
    id: "stu-anika",
    name: "Anika Rao",
    grade: "Class X",
    risk: "At risk",
    score: 47,
    streak: 1,
    currentChapter: "Pair of Linear Equations",
    currentExercise: "Exercise 3.1",
    progress: 28,
    averageScore: 51,
    weakConcepts: [
      { concept: "Linear graph plotting", score: 38 },
      { concept: "Equation substitution", score: 44 },
      { concept: "Word problem setup", score: 41 },
    ],
    submissions: [
      { exercise: "Exercise 3.1", status: "OCR failed", score: null, submittedAt: "38 min ago" },
      { exercise: "Exercise 2.2", status: "Completed", score: 54, submittedAt: "5 days ago" },
    ],
    activity: [
      "OCR failed for latest upload",
      "Missed two study days",
      "Scored below threshold on Exercise 2.2",
    ],
    recommendedRemediation: "Mark for support and assign graph plotting foundation lesson.",
  },
];

const allValue = "all";

export function StudentManagement() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(allValue);
  const [risk, setRisk] = useState(allValue);
  const [chapter, setChapter] = useState(allValue);
  const [scoreBand, setScoreBand] = useState(allValue);
  const [selectedId, setSelectedId] = useState(students[0].id);
  const [supportIds, setSupportIds] = useState<Set<string>>(new Set(["stu-anika"]));
  const [remediationIds, setRemediationIds] = useState<Set<string>>(new Set(["stu-mira"]));

  const chapters = useMemo(
    () => Array.from(new Set(students.map((student) => student.currentChapter))),
    [],
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesQuery = student.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesGrade = grade === allValue || student.grade === grade;
      const matchesRisk = risk === allValue || student.risk === risk;
      const matchesChapter = chapter === allValue || student.currentChapter === chapter;
      const matchesScore =
        scoreBand === allValue ||
        (scoreBand === "below-60" && student.score < 60) ||
        (scoreBand === "60-79" && student.score >= 60 && student.score <= 79) ||
        (scoreBand === "80-plus" && student.score >= 80);

      return matchesQuery && matchesGrade && matchesRisk && matchesChapter && matchesScore;
    });
  }, [chapter, grade, query, risk, scoreBand]);

  const selectedStudent =
    filteredStudents.find((student) => student.id === selectedId) ?? filteredStudents[0];

  function toggleSupport(studentId: string) {
    setSupportIds((current) => {
      const next = new Set(current);
      if (next.has(studentId)) next.delete(studentId);
      else next.add(studentId);
      return next;
    });
  }

  function assignRemediation(studentId: string) {
    setRemediationIds((current) => new Set(current).add(studentId));
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <UsersIcon />
            Student management
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold">Learners needing attention</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Search students, filter by risk and chapter, inspect progress, and assign support from
            one workspace.
          </p>
        </div>
        <div className="grid gap-2 text-center sm:min-w-80 sm:grid-cols-3">
          <SummaryTile label="Students" value={String(students.length)} />
          <SummaryTile
            label="Need support"
            value={String(students.filter((student) => student.risk !== "Strong").length)}
          />
          <SummaryTile
            label="Below 60"
            value={String(students.filter((student) => student.score < 60).length)}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_0.7fr_0.8fr_0.8fr_0.7fr]">
        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by student name"
            className="pl-9"
          />
        </div>
        <FilterSelect value={grade} onValueChange={setGrade} placeholder="Class">
          <SelectItem value={allValue}>All classes</SelectItem>
          <SelectItem value="Class X">Class X</SelectItem>
        </FilterSelect>
        <FilterSelect value={risk} onValueChange={setRisk} placeholder="Risk">
          <SelectItem value={allValue}>All risk levels</SelectItem>
          <SelectItem value="At risk">At risk</SelectItem>
          <SelectItem value="Needs help">Needs help</SelectItem>
          <SelectItem value="On track">On track</SelectItem>
          <SelectItem value="Strong">Strong</SelectItem>
        </FilterSelect>
        <FilterSelect value={chapter} onValueChange={setChapter} placeholder="Chapter">
          <SelectItem value={allValue}>All chapters</SelectItem>
          {chapters.map((chapterName) => (
            <SelectItem key={chapterName} value={chapterName}>
              {chapterName}
            </SelectItem>
          ))}
        </FilterSelect>
        <FilterSelect value={scoreBand} onValueChange={setScoreBand} placeholder="Score">
          <SelectItem value={allValue}>All scores</SelectItem>
          <SelectItem value="below-60">Below 60</SelectItem>
          <SelectItem value="60-79">60-79</SelectItem>
          <SelectItem value="80-plus">80+</SelectItem>
        </FilterSelect>
      </div>

      <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border">
          <div className="hidden grid-cols-[1.2fr_0.55fr_0.75fr_0.85fr_0.7fr] bg-secondary/60 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground lg:grid">
            <span>Student</span>
            <span>Score</span>
            <span>Risk</span>
            <span>Chapter</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-border">
            {filteredStudents.map((student) => {
              const selected = student.id === selectedStudent?.id;
              const needsSupport = supportIds.has(student.id);

              return (
                <button
                  key={student.id}
                  onClick={() => setSelectedId(student.id)}
                  className={cn(
                    "grid w-full gap-3 px-4 py-4 text-left transition-colors lg:grid-cols-[1.2fr_0.55fr_0.75fr_0.85fr_0.7fr] lg:items-center",
                    selected ? "bg-primary/5" : "hover:bg-secondary/40",
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="min-w-0 break-words font-medium">{student.name}</span>
                      {needsSupport && (
                        <Badge variant="outline" className="border-warning/40 text-warning">
                          Support
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 break-words text-xs text-muted-foreground">
                      {student.grade} · {student.currentExercise}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold">{student.score}</div>
                    <div className="text-xs text-muted-foreground">avg {student.averageScore}%</div>
                  </div>
                  <RiskBadge risk={student.risk} />
                  <div className="min-w-0 text-sm text-muted-foreground">
                    <div className="truncate">{student.currentChapter}</div>
                    <Progress value={student.progress} className="mt-2 h-1.5" />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {selected ? "Selected" : "View details"}
                  </span>
                </button>
              );
            })}
            {filteredStudents.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No students match these filters.
              </div>
            )}
          </div>
        </div>

        {selectedStudent ? (
          <StudentDetail
            student={selectedStudent}
            needsSupport={supportIds.has(selectedStudent.id)}
            remediationAssigned={remediationIds.has(selectedStudent.id)}
            onToggleSupport={() => toggleSupport(selectedStudent.id)}
            onAssignRemediation={() => assignRemediation(selectedStudent.id)}
          />
        ) : (
          <EmptyStudentDetail />
        )}
      </div>
    </section>
  );
}

function StudentDetail({
  student,
  needsSupport,
  remediationAssigned,
  onToggleSupport,
  onAssignRemediation,
}: {
  student: StudentRecord;
  needsSupport: boolean;
  remediationAssigned: boolean;
  onToggleSupport: () => void;
  onAssignRemediation: () => void;
}) {
  return (
    <aside className="min-w-0 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-words font-display text-lg font-semibold">
              {student.name}
            </h3>
            <RiskBadge risk={student.risk} />
          </div>
          <p className="mt-1 break-words text-sm text-muted-foreground">
            {student.grade} · {student.currentChapter}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div className="font-display text-3xl font-bold">{student.score}</div>
          <div className="text-xs text-muted-foreground">Learning score</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <DetailMetric icon={Target} label="Progress" value={`${student.progress}%`} />
        <DetailMetric icon={Activity} label="Streak" value={`${student.streak}d`} />
        <DetailMetric icon={BookOpen} label="Average" value={`${student.averageScore}%`} />
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <AlertTriangle className="h-4 w-4 text-warning" />
          Weak concepts
        </div>
        <div className="mt-3 space-y-2">
          {student.weakConcepts.map((item) => (
            <div key={item.concept} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 break-words">{item.concept}</span>
                <span className="shrink-0 font-semibold text-warning">{item.score}%</span>
              </div>
              <Progress value={item.score} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="h-4 w-4 text-primary" />
          Recent submissions
        </div>
        <div className="mt-3 space-y-2">
          {student.submissions.map((submission) => (
            <div
              key={`${submission.exercise}-${submission.submittedAt}`}
              className="rounded-lg bg-secondary/50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="break-words text-sm font-medium">{submission.exercise}</div>
                  <div className="text-xs text-muted-foreground">{submission.submittedAt}</div>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {submission.score === null ? submission.status : `${submission.score}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border p-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          Remediation
        </div>
        <p className="mt-2 break-words text-sm text-muted-foreground">
          {student.recommendedRemediation}
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            size="sm"
            variant={needsSupport ? "outline" : "default"}
            onClick={onToggleSupport}
            className="w-full sm:w-auto"
          >
            <LifeBuoy className="h-4 w-4" />
            {needsSupport ? "Support marked" : "Mark needs support"}
          </Button>
          <Button
            size="sm"
            variant={remediationAssigned ? "outline" : "default"}
            onClick={onAssignRemediation}
            disabled={remediationAssigned}
            className="w-full sm:w-auto"
          >
            <CheckCircle2 className="h-4 w-4" />
            {remediationAssigned ? "Remediation assigned" : "Assign remediation"}
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-semibold">Recent activity</div>
        <ul className="mt-3 space-y-2">
          {student.activity.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  children: ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
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

function DetailMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg bg-secondary/50 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <div className="mt-2 break-words font-display text-lg font-bold">{value}</div>
      <div className="break-words text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const className =
    risk === "At risk"
      ? "bg-destructive/15 text-destructive"
      : risk === "Needs help"
        ? "bg-warning/15 text-warning"
        : risk === "Strong"
          ? "bg-success/15 text-success"
          : "bg-primary/10 text-primary";

  return (
    <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-medium", className)}>
      {risk}
    </span>
  );
}

function UsersIcon() {
  return <Users className="h-3.5 w-3.5" />;
}

function EmptyStudentDetail() {
  return (
    <aside className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
      <div>
        <Search className="mx-auto h-8 w-8 text-muted-foreground" />
        <h3 className="mt-3 font-display text-lg font-semibold">No student selected</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust the filters to find a student profile.
        </p>
      </div>
    </aside>
  );
}
