export type QuizTrackId =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'angular'
  | 'react'
  | 'nextjs'
  | 'vuejs'
  | 'tailwind'
  | 'pwa'
  | 'accessibility'
  | 'backend'
  | 'express'
  | 'graphql'
  | 'python-api'
  | 'websockets'
  | 'microservices'
  | 'databases'
  | 'postgresql'
  | 'mongodb'
  | 'redis'
  | 'docker'
  | 'kubernetes'
  | 'cicd'
  | 'testing'
  | 'linux-cli'
  | 'cs-fundamentals'
  | 'dsa'
  | 'system-design'
  | 'web-security'
  | 'ai-engineering';

export type TrackCategory =
  | 'Frontend & UI'
  | 'Frameworks & A11y'
  | 'Backend & APIs'
  | 'Databases & Cache'
  | 'Cloud & DevOps'
  | 'CS, Security & AI';

export type DifficultyLevel = 'Low' | 'Medium' | 'High';
export type DifficultyFilter = 'All' | DifficultyLevel;
export type QuizMode = 'timed' | 'practice';
export type ThemeMode = 'light' | 'dark';
export type RoleId = 'all' | 'student' | 'frontend' | 'fullstack' | 'senior';

export type ExperienceLevel =
  | 'Student / Fresher'
  | 'Junior (1-2 yrs)'
  | 'Mid-Level (3-5 yrs)'
  | 'Senior / Lead (5+ yrs)';

export interface RoleProfile {
  id: RoleId;
  label: string;
  tagline: string;
  description: string;
  defaultDifficulty: DifficultyFilter;
  defaultMode: QuizMode;
  recommendedTracks: QuizTrackId[];
}

export interface QuizQuestion {
  id: string;
  trackId: QuizTrackId;
  difficulty: DifficultyLevel;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizTrack {
  id: QuizTrackId;
  title: string;
  shortTitle: string;
  category: TrackCategory;
  summary: string;
  routePath: string;
  image: string;
  fallbackGradient: string;
  icon: string;
  passThreshold: number;
  keyTopics: string[];
  suitableRoles: RoleId[];
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  roleId: RoleId;
  organization: string;
  experienceLevel: ExperienceLevel;
  bio: string;
  authProvider: 'google' | 'local';
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttemptRecord {
  id: string;
  trackId: QuizTrackId;
  trackTitle: string;
  roleId: RoleId;
  mode: QuizMode;
  difficultyFilter: DifficultyFilter;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  accuracy: number;
  passed: boolean;
  durationSeconds: number;
  completedAt: string;
}

export interface CertificateRecord {
  id: string;
  userId: string;
  recipientName: string;
  recipientEmail: string;
  organization: string;
  roleId: RoleId;
  trackId: QuizTrackId;
  trackTitle: string;
  category: TrackCategory;
  difficultyFilter: DifficultyFilter;
  correctCount: number;
  totalQuestions: number;
  accuracy: number;
  verificationCode: string;
  issuedAt: string;
}

export interface TopicStatRecord {
  id: string;
  trackId: QuizTrackId;
  category: TrackCategory;
  topic: string;
  correct: number;
  total: number;
  updatedAt: string;
}

export interface DisciplineMastery {
  category: TrackCategory;
  totalTracks: number;
  tracksPassed: number;
  tracksAttempted: number;
  totalRuns: number;
  avgAccuracy: number | null;
  strongestTrack: string | null;
  weakestTopic: string | null;
}

export interface WeakTopicSummary {
  id: string;
  trackId: QuizTrackId;
  trackShortTitle: string;
  category: TrackCategory;
  topic: string;
  correct: number;
  total: number;
  accuracy: number;
}

export const LEVEL_QUESTION_COUNTS: Record<DifficultyFilter, number> = {
  Low: 5,
  Medium: 8,
  High: 12,
  All: 16,
};

export const ROLE_PROFILES: RoleProfile[] = [
  {
    id: 'all',
    label: 'All Roles',
    tagline: 'Full 31-Track Engineering Suite',
    description:
      'Explore all 31 assessment tracks across Frontend, Backend, Databases, DevOps, Security, and AI Engineering.',
    defaultDifficulty: 'All',
    defaultMode: 'timed',
    recommendedTracks: [
      'html',
      'css',
      'javascript',
      'typescript',
      'angular',
      'react',
      'backend',
      'databases',
      'cs-fundamentals',
      'system-design',
    ],
  },
  {
    id: 'student',
    label: 'Student',
    tagline: 'CS & Web Foundations',
    description:
      'Ideal for university CS students and bootcamp learners starting at Low difficulty (5 Qs) in untimed Practice mode.',
    defaultDifficulty: 'Low',
    defaultMode: 'practice',
    recommendedTracks: [
      'html',
      'css',
      'javascript',
      'databases',
      'cs-fundamentals',
      'dsa',
      'linux-cli',
      'testing',
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend Dev',
    tagline: 'UI, Styling & Reactive Apps',
    description:
      'Focused on semantic DOM, CSS layout systems, JavaScript, TypeScript, Angular, React, Next.js, and WCAG accessibility.',
    defaultDifficulty: 'Medium',
    defaultMode: 'timed',
    recommendedTracks: [
      'html',
      'css',
      'javascript',
      'typescript',
      'angular',
      'react',
      'nextjs',
      'vuejs',
      'tailwind',
      'accessibility',
      'pwa',
    ],
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Dev',
    tagline: 'APIs, Databases & Client State',
    description:
      'End-to-end assessments spanning TypeScript, Angular/React, Node.js, Express, GraphQL, PostgreSQL, Redis, Docker, and CI/CD.',
    defaultDifficulty: 'Medium',
    defaultMode: 'timed',
    recommendedTracks: [
      'javascript',
      'typescript',
      'angular',
      'react',
      'backend',
      'express',
      'graphql',
      'databases',
      'postgresql',
      'mongodb',
      'redis',
      'docker',
      'cicd',
    ],
  },
  {
    id: 'senior',
    label: 'Senior / Lead',
    tagline: 'Architecture, Scale & AppSec',
    description:
      'High-bar 12-question assessments covering Distributed Systems, Kubernetes, PostgreSQL tuning, Security, and AI Engineering.',
    defaultDifficulty: 'High',
    defaultMode: 'timed',
    recommendedTracks: [
      'typescript',
      'angular',
      'backend',
      'microservices',
      'postgresql',
      'redis',
      'kubernetes',
      'system-design',
      'web-security',
      'ai-engineering',
      'dsa',
    ],
  },
];
