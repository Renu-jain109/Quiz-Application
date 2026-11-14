import { DifficultyLevel, QuizQuestion, QuizTrackId } from '../quiz-types';

export function q(
  id: string,
  trackId: QuizTrackId,
  difficulty: DifficultyLevel,
  topic: string,
  question: string,
  options: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
  codeSnippet?: string
): QuizQuestion {
  return {
    id,
    trackId,
    difficulty,
    topic,
    question,
    options,
    correctAnswer: options[correctIndex],
    explanation,
    ...(codeSnippet ? { codeSnippet } : {}),
  };
}
