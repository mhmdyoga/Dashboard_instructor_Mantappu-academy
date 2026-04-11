export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  order: number;
  points: number;
  options: Option[];
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  courseId: string;
  questions: Question[];
}

export interface QuizResult {
  score: number;
  isPassed: boolean;
  passingScore: number;
  totalQuestions: number;
  correctAnswers: number;
  attemptId: string;
  message: string;
}

export interface CreateQuizPayload {
  title: string;
  description?: string;
  passingScore: number;
  questions: {
    text: string;
    order: number;
    points: number;
    options: { text: string; isCorrect: boolean }[];
  }[];
}