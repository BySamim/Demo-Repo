import { Link } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  ListChecks,
  Mic,
  Pencil,
  Plus,
  Trash2,
  Wand2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { chapters } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ReadinessKey = "script" | "voice" | "diagrams" | "examples" | "quiz";

type ContentTopic = {
  id: string;
  title: string;
  summary: string;
  examples: string[];
};

type ContentExercise = {
  id: string;
  number: string;
  title: string;
  questionCount: number;
};

type ContentChapter = {
  id: string;
  number: number;
  title: string;
  description: string;
  published: boolean;
  readiness: Record<ReadinessKey, boolean>;
  topics: ContentTopic[];
  exercises: ContentExercise[];
};

const readinessItems: Array<{ key: ReadinessKey; label: string; icon: typeof FileText }> = [
  { key: "script", label: "Script", icon: FileText },
  { key: "voice", label: "Voice", icon: Mic },
  { key: "diagrams", label: "Diagrams", icon: Wand2 },
  { key: "examples", label: "Examples", icon: BookOpen },
  { key: "quiz", label: "Quiz", icon: ListChecks },
];

const initialContent: ContentChapter[] = chapters.map((chapter, index) => ({
  id: chapter.id,
  number: chapter.number,
  title: chapter.title,
  description: chapter.description,
  published: chapter.progress > 0,
  readiness: {
    script: chapter.topics.length > 0 || index < 3,
    voice: index < 2,
    diagrams: chapter.number !== 5,
    examples: chapter.topics.some((topic) => topic.examples.length > 0),
    quiz: chapter.exercises.length > 0,
  },
  topics: chapter.topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    summary: topic.summary,
    examples: topic.examples.map((example) => example.problem),
  })),
  exercises: chapter.exercises.map((exercise) => ({
    id: exercise.id,
    number: exercise.number,
    title: exercise.title,
    questionCount: exercise.questionCount,
  })),
}));

const sourceChapterIds = new Set(chapters.map((chapter) => chapter.id));

export function ContentManagement() {
  const [content, setContent] = useState(initialContent);
  const [selectedId, setSelectedId] = useState(initialContent[0]?.id ?? "");
  const [draftTitle, setDraftTitle] = useState(initialContent[0]?.title ?? "");
  const [draftDescription, setDraftDescription] = useState(initialContent[0]?.description ?? "");

  const selectedChapter = content.find((chapter) => chapter.id === selectedId) ?? content[0];
  const readinessPercent = selectedChapter ? getReadinessPercent(selectedChapter) : 0;
  const firstTopicId = selectedChapter?.topics[0]?.id;
  const canPreviewChapter = selectedChapter ? sourceChapterIds.has(selectedChapter.id) : false;

  const publishedCount = useMemo(
    () => content.filter((chapter) => chapter.published).length,
    [content],
  );

  function selectChapter(chapterId: string) {
    const next = content.find((chapter) => chapter.id === chapterId);
    if (!next) return;
    setSelectedId(chapterId);
    setDraftTitle(next.title);
    setDraftDescription(next.description);
  }

  function updateSelectedChapter(updater: (chapter: ContentChapter) => ContentChapter) {
    setContent((current) =>
      current.map((chapter) => (chapter.id === selectedChapter?.id ? updater(chapter) : chapter)),
    );
  }

  function saveChapterDetails() {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      title: draftTitle.trim() || chapter.title,
      description: draftDescription.trim() || chapter.description,
    }));
  }

  function addChapter() {
    const nextNumber = Math.max(...content.map((chapter) => chapter.number), 0) + 1;
    const chapter: ContentChapter = {
      id: `draft-ch-${Date.now()}`,
      number: nextNumber,
      title: `New Chapter ${nextNumber}`,
      description: "Draft chapter description.",
      published: false,
      readiness: {
        script: false,
        voice: false,
        diagrams: false,
        examples: false,
        quiz: false,
      },
      topics: [],
      exercises: [],
    };

    setContent((current) => [...current, chapter]);
    setSelectedId(chapter.id);
    setDraftTitle(chapter.title);
    setDraftDescription(chapter.description);
  }

  function deleteChapter() {
    if (!selectedChapter || content.length === 1) return;
    const nextContent = content.filter((chapter) => chapter.id !== selectedChapter.id);
    const nextSelected = nextContent[0];
    setContent(nextContent);
    setSelectedId(nextSelected.id);
    setDraftTitle(nextSelected.title);
    setDraftDescription(nextSelected.description);
  }

  function addTopic() {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      topics: [
        ...chapter.topics,
        {
          id: `draft-topic-${Date.now()}`,
          title: `Topic ${chapter.number}.${chapter.topics.length + 1}`,
          summary: "Draft topic summary.",
          examples: [],
        },
      ],
    }));
  }

  function updateTopic(topicId: string, field: "title" | "summary", value: string) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      topics: chapter.topics.map((topic) =>
        topic.id === topicId ? { ...topic, [field]: value } : topic,
      ),
    }));
  }

  function deleteTopic(topicId: string) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      topics: chapter.topics.filter((topic) => topic.id !== topicId),
    }));
  }

  function addExample(topicId: string) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      readiness: { ...chapter.readiness, examples: true },
      topics: chapter.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              examples: [...topic.examples, "New solved example draft."],
            }
          : topic,
      ),
    }));
  }

  function deleteExample(topicId: string, exampleIndex: number) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      topics: chapter.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              examples: topic.examples.filter((_, index) => index !== exampleIndex),
            }
          : topic,
      ),
    }));
  }

  function addExercise() {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      readiness: { ...chapter.readiness, quiz: true },
      exercises: [
        ...chapter.exercises,
        {
          id: `draft-exercise-${Date.now()}`,
          number: `${chapter.number}.${chapter.exercises.length + 1}`,
          title: "New exercise draft",
          questionCount: 5,
        },
      ],
    }));
  }

  function updateExercise(exerciseId: string, field: "title" | "questionCount", value: string) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      exercises: chapter.exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              [field]: field === "questionCount" ? Math.max(Number(value) || 0, 0) : value,
            }
          : exercise,
      ),
    }));
  }

  function deleteExercise(exerciseId: string) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      exercises: chapter.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  }

  function toggleReadiness(key: ReadinessKey) {
    updateSelectedChapter((chapter) => ({
      ...chapter,
      readiness: { ...chapter.readiness, [key]: !chapter.readiness[key] },
    }));
  }

  function togglePublished() {
    updateSelectedChapter((chapter) => ({ ...chapter, published: !chapter.published }));
  }

  if (!selectedChapter) return null;

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-4 shadow-soft sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
            <BookOpen className="h-3.5 w-3.5" />
            Content management
          </div>
          <h2 className="mt-3 font-display text-xl font-semibold">
            Chapters, lessons and exercises
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Prepare chapter content, track lesson readiness, publish when complete, and preview the
            student-facing experience.
          </p>
        </div>
        <div className="grid gap-2 text-center sm:min-w-80 sm:grid-cols-3">
          <SummaryTile label="Chapters" value={String(content.length)} />
          <SummaryTile label="Published" value={String(publishedCount)} />
          <SummaryTile label="Ready" value={`${readinessPercent}%`} />
        </div>
      </div>

      <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(18rem,0.6fr)_minmax(0,1.4fr)]">
        <aside className="min-w-0 rounded-xl border border-border bg-background p-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Chapter library
            </h3>
            <Button size="sm" variant="outline" onClick={addChapter} className="shrink-0">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="mt-3 space-y-2">
            {content.map((chapter) => {
              const selected = chapter.id === selectedChapter.id;
              return (
                <button
                  key={chapter.id}
                  onClick={() => selectChapter(chapter.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-secondary/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground">Chapter {chapter.number}</div>
                      <div className="truncate font-medium">{chapter.title}</div>
                    </div>
                    <PublishBadge published={chapter.published} />
                  </div>
                  <Progress value={getReadinessPercent(chapter)} className="mt-3 h-1.5" />
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{chapter.topics.length} topics</span>
                    <span>{chapter.exercises.length} exercises</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
              <div className="min-w-0">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Chapter title
                </label>
                <Input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  className="mt-2"
                />
                <label className="mt-4 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <Textarea
                  value={draftDescription}
                  onChange={(event) => setDraftDescription(event.target.value)}
                  className="mt-2 min-h-24"
                />
              </div>
              <div className="space-y-2">
                <Button className="w-full" onClick={saveChapterDetails}>
                  <Pencil className="h-4 w-4" />
                  Save changes
                </Button>
                <Button className="w-full" variant="outline" onClick={togglePublished}>
                  {selectedChapter.published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  disabled={content.length === 1}
                  onClick={deleteChapter}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete chapter
                </Button>
                {canPreviewChapter ? (
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/chapters/$chapterId" params={{ chapterId: selectedChapter.id }}>
                      <Eye className="h-4 w-4" />
                      Preview chapter
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    <Eye className="h-4 w-4" />
                    Preview chapter
                  </Button>
                )}
                {firstTopicId && sourceChapterIds.has(selectedChapter.id) && (
                  <Button asChild className="w-full" variant="outline">
                    <Link to="/lesson/$topicId" params={{ topicId: firstTopicId }}>
                      <Eye className="h-4 w-4" />
                      Preview lesson
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Lesson readiness</h3>
                <p className="text-sm text-muted-foreground">
                  Publish only when the student lesson materials are complete.
                </p>
              </div>
              <div className="font-display text-3xl font-bold">{readinessPercent}%</div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {readinessItems.map(({ key, label, icon: Icon }) => {
                const ready = selectedChapter.readiness[key];
                return (
                  <button
                    key={key}
                    onClick={() => toggleReadiness(key)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-colors",
                      ready
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-border hover:bg-secondary/50",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="mt-2 text-sm font-medium">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {ready ? "Ready" : "Missing"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid min-w-0 gap-5 lg:grid-cols-2">
            <ContentPanel title="Topics" actionLabel="Add topic" onAction={addTopic}>
              <div className="space-y-3">
                {selectedChapter.topics.map((topic) => (
                  <div key={topic.id} className="min-w-0 rounded-xl border border-border p-3">
                    <Input
                      value={topic.title}
                      onChange={(event) => updateTopic(topic.id, "title", event.target.value)}
                    />
                    <Textarea
                      value={topic.summary}
                      onChange={(event) => updateTopic(topic.id, "summary", event.target.value)}
                      className="mt-2 min-h-20"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addExample(topic.id)}
                        className="w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Add example
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteTopic(topic.id)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete topic
                      </Button>
                    </div>
                    {topic.examples.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {topic.examples.map((example, index) => (
                          <div
                            key={`${topic.id}-${index}`}
                            className="flex min-w-0 items-start gap-2 rounded-lg bg-secondary/50 p-2 text-sm"
                          >
                            <span className="min-w-0 flex-1 break-words">{example}</span>
                            <button
                              onClick={() => deleteExample(topic.id, index)}
                              className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                              aria-label="Delete example"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {selectedChapter.topics.length === 0 && <EmptyState label="No topics yet." />}
              </div>
            </ContentPanel>

            <ContentPanel title="Exercises" actionLabel="Add exercise" onAction={addExercise}>
              <div className="space-y-3">
                {selectedChapter.exercises.map((exercise) => (
                  <div key={exercise.id} className="min-w-0 rounded-xl border border-border p-3">
                    <div className="grid gap-2 sm:grid-cols-[5rem_1fr_5rem]">
                      <Input value={exercise.number} readOnly aria-label="Exercise number" />
                      <Input
                        value={exercise.title}
                        onChange={(event) =>
                          updateExercise(exercise.id, "title", event.target.value)
                        }
                      />
                      <Input
                        type="number"
                        min={0}
                        value={exercise.questionCount}
                        onChange={(event) =>
                          updateExercise(exercise.id, "questionCount", event.target.value)
                        }
                        aria-label="Question count"
                      />
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteExercise(exercise.id)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete exercise
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedChapter.exercises.length === 0 && <EmptyState label="No exercises yet." />}
              </div>
            </ContentPanel>
          </div>
        </div>
      </div>
    </section>
  );
}

function getReadinessPercent(chapter: ContentChapter) {
  const readyCount = readinessItems.filter((item) => chapter.readiness[item.key]).length;
  return Math.round((readyCount / readinessItems.length) * 100);
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="font-display text-xl font-bold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

function PublishBadge({ published }: { published: boolean }) {
  return (
    <Badge
      variant="outline"
      className={published ? "border-success/40 text-success" : "border-warning/40 text-warning"}
    >
      {published ? "Published" : "Draft"}
    </Badge>
  );
}

function ContentPanel({
  title,
  actionLabel,
  onAction,
  children,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <Button size="sm" variant="outline" onClick={onAction} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      <CheckCircle2 className="mx-auto mb-2 h-5 w-5" />
      {label}
    </div>
  );
}
