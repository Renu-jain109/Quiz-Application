export * from './quiz-types';
export { QUIZ_TRACKS } from './tracks-catalog';

import { QuizQuestion } from './quiz-types';
import { FRONTEND_QUESTIONS } from './questions/frontend-questions';
import { FRAMEWORKS_QUESTIONS } from './questions/frameworks-questions';
import { BACKEND_QUESTIONS } from './questions/backend-questions';
import { DATABASES_QUESTIONS } from './questions/databases-questions';
import { DEVOPS_QUESTIONS } from './questions/devops-questions';
import { CS_SECURITY_QUESTIONS } from './questions/cs-security-questions';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  ...FRONTEND_QUESTIONS,
  ...FRAMEWORKS_QUESTIONS,
  ...BACKEND_QUESTIONS,
  ...DATABASES_QUESTIONS,
  ...DEVOPS_QUESTIONS,
  ...CS_SECURITY_QUESTIONS,
];
