// Mock data for the AI Math Learning Platform
export type ExerciseStatus = "locked" | "available" | "in_progress" | "completed";

export interface Example {
  id: string;
  title: string;
  problem: string;
  watched: boolean;
}

export interface Topic {
  id: string;
  title: string;
  summary: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
  examples: Example[];
}

export interface Exercise {
  id: string;
  number: string;
  title: string;
  questionCount: number;
  status: ExerciseStatus;
  score?: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  progress: number;
  topics: Topic[];
  exercises: Exercise[];
}

export const chapters: Chapter[] = [
  {
    id: "ch-1",
    number: 1,
    title: "Real Numbers",
    description:
      "Euclid's division lemma, Fundamental Theorem of Arithmetic, irrational numbers, and decimal expansions.",
    progress: 90,
    topics: [
      {
        id: "t-1-1",
        title: "Euclid's Division Lemma",
        summary:
          "Understand division as repeated subtraction and find the HCF using Euclid's algorithm.",
        duration: "12 min",
        completed: true,
        videoUrl:
          `${import.meta.env.BASE_URL}videos/Class_10_Maths_Chapter_1_Real_Numbers___Full_Concept_Video.mp4`,
        examples: [
          {
            id: "e-1-1-1",
            title: "Example 1",
            problem: "Use Euclid's algorithm to find HCF of 4052 and 12576.",
            watched: true,
          },
          {
            id: "e-1-1-2",
            title: "Example 2",
            problem: "Show that any positive odd integer is of the form 6q+1, 6q+3 or 6q+5.",
            watched: true,
          },
        ],
      },
      {
        id: "t-1-2",
        title: "Fundamental Theorem of Arithmetic",
        summary: "Every composite number can be expressed as a product of primes in a unique way.",
        duration: "15 min",
        completed: true,
        examples: [
          {
            id: "e-1-2-1",
            title: "Example 3",
            problem: "Find the LCM and HCF of 6 and 20 by prime factorization.",
            watched: true,
          },
          {
            id: "e-1-2-2",
            title: "Example 4",
            problem: "Prove that √2 is irrational.",
            watched: false,
          },
        ],
      },
      {
        id: "t-1-3",
        title: "Decimal Expansions",
        summary: "Terminating and non-terminating recurring decimals.",
        duration: "9 min",
        completed: false,
        examples: [
          {
            id: "e-1-3-1",
            title: "Example 5",
            problem: "Without long division, state whether 13/3125 is terminating.",
            watched: false,
          },
        ],
      },
    ],
    exercises: [
      {
        id: "ex-1-1",
        number: "1.1",
        title: "Euclid's Algorithm Practice",
        questionCount: 5,
        status: "completed",
        score: 92,
      },
      {
        id: "ex-1-2",
        number: "1.2",
        title: "Prime Factorization",
        questionCount: 7,
        status: "completed",
        score: 78,
      },
      {
        id: "ex-1-3",
        number: "1.3",
        title: "Irrational Numbers",
        questionCount: 3,
        status: "in_progress",
      },
      {
        id: "ex-1-4",
        number: "1.4",
        title: "Decimal Expansions",
        questionCount: 3,
        status: "locked",
      },
    ],
  },
  {
    id: "ch-2",
    number: 2,
    title: "Polynomials",
    description: "Zeroes of polynomials, geometric meaning, and division algorithm.",
    progress: 60,
    topics: [],
    exercises: [
      {
        id: "ex-2-1",
        number: "2.1",
        title: "Zeroes of a Polynomial",
        questionCount: 6,
        status: "completed",
        score: 84,
      },
      {
        id: "ex-2-2",
        number: "2.2",
        title: "Relationship between Zeroes and Coefficients",
        questionCount: 8,
        status: "in_progress",
      },
      {
        id: "ex-2-3",
        number: "2.3",
        title: "Division Algorithm",
        questionCount: 5,
        status: "locked",
      },
    ],
  },
  {
    id: "ch-3",
    number: 3,
    title: "Pair of Linear Equations in Two Variables",
    description: "Graphical and algebraic methods of solving linear equations.",
    progress: 35,
    topics: [],
    exercises: [],
  },
  {
    id: "ch-4",
    number: 4,
    title: "Quadratic Equations",
    description: "Roots, discriminant, and applications of quadratic equations.",
    progress: 10,
    topics: [],
    exercises: [],
  },
  {
    id: "ch-5",
    number: 5,
    title: "Arithmetic Progressions",
    description: "nth term and sum of n terms of an AP.",
    progress: 0,
    topics: [],
    exercises: [],
  },
  {
    id: "ch-6",
    number: 6,
    title: "Triangles",
    description: "Similarity of triangles, theorems and applications.",
    progress: 0,
    topics: [],
    exercises: [],
  },
];

export const studentProfile = {
  name: "Aarav Sharma",
  grade: "Class X",
  learningScore: 78,
  streak: 12,
  chaptersStarted: 4,
  averageScore: 84,
  hoursLearned: 36,
};

export function getChapter(id: string) {
  return chapters.find((c) => c.id === id);
}
