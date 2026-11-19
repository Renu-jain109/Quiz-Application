import { Injectable, computed, inject, signal } from '@angular/core';
import {
  CertificateRecord,
  DifficultyFilter,
  DifficultyLevel,
  DisciplineMastery,
  LEVEL_QUESTION_COUNTS,
  QUIZ_QUESTIONS,
  QUIZ_TRACKS,
  QuizAttemptRecord,
  QuizMode,
  QuizQuestion,
  QuizTrack,
  QuizTrackId,
  ROLE_PROFILES,
  RoleId,
  RoleProfile,
  ThemeMode,
  TopicStatRecord,
  TrackCategory,
  WeakTopicSummary,
} from '../data/quiz-bank';
import { AuthService } from './auth.service';

export type {
  CertificateRecord,
  DifficultyFilter,
  DifficultyLevel,
  DisciplineMastery,
  QuizAttemptRecord,
  QuizMode,
  QuizQuestion,
  QuizTrack,
  QuizTrackId,
  RoleId,
  RoleProfile,
  ThemeMode,
  TopicStatRecord,
  TrackCategory,
  WeakTopicSummary,
};

export { LEVEL_QUESTION_COUNTS };

const STORAGE_ATTEMPTS_KEY = 'quizforge_attempts_v1';
const STORAGE_BOOKMARKS_KEY = 'quizforge_bookmarks_v1';
const STORAGE_CERTIFICATES_KEY = 'quizforge_certificates_v1';
const STORAGE_TOPIC_STATS_KEY = 'quizforge_topic_stats_v1';
const STORAGE_THEME_KEY = 'quizforge_theme_v1';
const STORAGE_ROLE_KEY = 'quizforge_role_v1';

const DIFFICULTY_RANK: Record<DifficultyFilter, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  All: 4,
};

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly authService = inject(AuthService);

  readonly heroImage = '/assets/images/hero_workspace_1794591540163.jpg';
  readonly roles: RoleProfile[] = ROLE_PROFILES;
  readonly tracks: QuizTrack[] = QUIZ_TRACKS;
  readonly questions: QuizQuestion[] = QUIZ_QUESTIONS;
  readonly trackCategories: TrackCategory[] = [
    'Frontend & UI',
    'Frameworks & A11y',
    'Backend & APIs',
    'Databases & Cache',
    'Cloud & DevOps',
    'CS, Security & AI',
  ];

  private readonly attemptsSignal = signal<QuizAttemptRecord[]>(this.loadAttempts());
  private readonly bookmarksSignal = signal<string[]>(this.loadBookmarks());
  private readonly certificatesSignal = signal<CertificateRecord[]>(this.loadCertificates());
  private readonly topicStatsSignal = signal<TopicStatRecord[]>(this.loadTopicStats());
  private readonly themeSignal = signal<ThemeMode>(this.loadTheme());
  private readonly roleSignal = signal<RoleId>(this.loadRole());

  readonly attempts = this.attemptsSignal.asReadonly();
  readonly bookmarkedIds = this.bookmarksSignal.asReadonly();
  readonly certificates = this.certificatesSignal.asReadonly();
  readonly topicStats = this.topicStatsSignal.asReadonly();
  readonly theme = this.themeSignal.asReadonly();
  readonly selectedRole = this.roleSignal.asReadonly();

  readonly activeRoleProfile = computed<RoleProfile>(
    () => this.roles.find((r) => r.id === this.roleSignal()) ?? this.roles[0]
  );

  readonly totalQuestionsCount = computed(() => this.questions.length);

  readonly overallStats = computed(() => {
    const list = this.attemptsSignal();
    const totalAttempts = list.length;
    const passedAttempts = list.filter((a) => a.passed).length;
    const avgAccuracy =
      totalAttempts === 0
        ? 0
        : Math.round(list.reduce((sum, item) => sum + item.accuracy, 0) / totalAttempts);
    const uniqueTracksPassed = new Set(list.filter((a) => a.passed).map((a) => a.trackId)).size;
    return {
      totalAttempts,
      passedAttempts,
      avgAccuracy,
      uniqueTracksPassed,
      bookmarkCount: this.bookmarksSignal().length,
      certificateCount: this.certificatesSignal().length,
    };
  });

  readonly bookmarkedQuestions = computed(() => {
    const ids = new Set(this.bookmarksSignal());
    return this.questions.filter((q) => ids.has(q.id));
  });

  readonly disciplineMastery = computed<DisciplineMastery[]>(() => {
    const attempts = this.attemptsSignal();
    const stats = this.topicStatsSignal();

    return this.trackCategories.map((category) => {
      const catTracks = this.tracks.filter((t) => t.category === category);
      const catTrackIds = new Set(catTracks.map((t) => t.id));
      const catAttempts = attempts.filter((a) => catTrackIds.has(a.trackId));
      const passedTrackIds = new Set(
        catAttempts.filter((a) => a.passed).map((a) => a.trackId)
      );
      const attemptedTrackIds = new Set(catAttempts.map((a) => a.trackId));

      const avgAccuracy =
        catAttempts.length === 0
          ? null
          : Math.round(
              catAttempts.reduce((sum, a) => sum + a.accuracy, 0) / catAttempts.length
            );

      let strongestTrack: string | null = null;
      let highestBest = -1;
      for (const track of catTracks) {
        const trackAttempts = catAttempts.filter((a) => a.trackId === track.id);
        if (trackAttempts.length > 0) {
          const best = Math.max(...trackAttempts.map((a) => a.accuracy));
          if (best > highestBest) {
            highestBest = best;
            strongestTrack = track.shortTitle;
          }
        }
      }

      const catTopicStats = stats.filter(
        (s) => s.category === category && s.total > 0
      );
      let weakestTopic: string | null = null;
      let lowestRatio = 1.01;
      for (const s of catTopicStats) {
        const ratio = s.correct / s.total;
        if (ratio < 0.75 && ratio < lowestRatio) {
          lowestRatio = ratio;
          weakestTopic = s.topic;
        }
      }

      return {
        category,
        totalTracks: catTracks.length,
        tracksPassed: passedTrackIds.size,
        tracksAttempted: attemptedTrackIds.size,
        totalRuns: catAttempts.length,
        avgAccuracy,
        strongestTrack,
        weakestTopic,
      };
    });
  });

  readonly weakTopics = computed<WeakTopicSummary[]>(() => {
    return this.topicStatsSignal()
      .filter((s) => s.total > 0 && Math.round((s.correct / s.total) * 100) < 75)
      .map((s) => ({
        id: s.id,
        trackId: s.trackId,
        trackShortTitle: this.getTrack(s.trackId).shortTitle,
        category: s.category,
        topic: s.topic,
        correct: s.correct,
        total: s.total,
        accuracy: Math.round((s.correct / s.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total);
  });

  constructor() {
    this.applyTheme(this.themeSignal());
    this.authService.registerSyncHandler(
      ({ roleId, bookmarkedIds, attempts, certificates, topicStats }) => {
        if (roleId) {
          this.roleSignal.set(roleId);
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(STORAGE_ROLE_KEY, roleId);
          }
        }
        if (bookmarkedIds) {
          this.bookmarksSignal.set(bookmarkedIds);
          this.persistJson(STORAGE_BOOKMARKS_KEY, bookmarkedIds);
        }
        if (attempts && attempts.length > 0) {
          this.attemptsSignal.set(attempts);
          this.persistJson(STORAGE_ATTEMPTS_KEY, attempts);
        }
        if (certificates && certificates.length > 0) {
          this.certificatesSignal.update((localCerts) => {
            const seen = new Set(certificates.map((c) => c.id));
            const merged = [...certificates, ...localCerts.filter((c) => !seen.has(c.id))].slice(
              0,
              100
            );
            this.persistJson(STORAGE_CERTIFICATES_KEY, merged);
            return merged;
          });
        }
        if (topicStats && topicStats.length > 0) {
          this.topicStatsSignal.update((localStats) => {
            const byId = new Map<string, TopicStatRecord>();
            for (const s of localStats) {
              byId.set(s.id, s);
            }
            for (const remote of topicStats) {
              const existing = byId.get(remote.id);
              if (!existing || remote.total >= existing.total) {
                byId.set(remote.id, remote);
              }
            }
            const merged = Array.from(byId.values());
            this.persistJson(STORAGE_TOPIC_STATS_KEY, merged);
            return merged;
          });
        }
      }
    );

    const profile = this.authService.profile();
    if (profile?.roleId) {
      this.roleSignal.set(profile.roleId);
    }
  }

  getTrack(trackId: QuizTrackId): QuizTrack {
    return this.tracks.find((t) => t.id === trackId) ?? this.tracks[0];
  }

  getRoleProfile(roleId: RoleId): RoleProfile {
    return this.roles.find((r) => r.id === roleId) ?? this.roles[0];
  }

  setRole(roleId: RoleId): void {
    this.roleSignal.set(roleId);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_ROLE_KEY, roleId);
    }
    void this.authService.syncRolePreference(roleId);
  }

  isTrackRecommendedForRole(trackId: QuizTrackId, roleId: RoleId = this.roleSignal()): boolean {
    if (roleId === 'all') return true;
    const track = this.tracks.find((t) => t.id === trackId);
    const profile = this.getRoleProfile(roleId);
    return (
      profile.recommendedTracks.includes(trackId) ||
      Boolean(track?.suitableRoles.includes(roleId))
    );
  }

  getLevelQuestionCount(level: DifficultyFilter): number {
    return LEVEL_QUESTION_COUNTS[level] ?? 16;
  }

  getLevelShortLabel(level: DifficultyFilter): string {
    switch (level) {
      case 'Low':
        return 'Low · 5 Qs';
      case 'Medium':
        return 'Medium · 8 Qs';
      case 'High':
        return 'High · 12 Qs';
      case 'All':
        return 'Progressive · 16 Qs';
    }
  }

  getHighestMasteredLevel(trackId: QuizTrackId): DifficultyFilter | null {
    const passedRuns = this.attemptsSignal().filter(
      (a) => a.trackId === trackId && a.passed
    );
    if (passedRuns.length === 0) return null;
    let best: DifficultyFilter = passedRuns[0].difficultyFilter;
    for (const run of passedRuns) {
      if ((DIFFICULTY_RANK[run.difficultyFilter] ?? 0) > (DIFFICULTY_RANK[best] ?? 0)) {
        best = run.difficultyFilter;
      }
    }
    return best;
  }

  /**
   * Progressive level scaling:
   * - Low:    5 Low questions
   * - Medium: 3 Low + 5 Medium = 8 questions (ordered Low -> Medium)
   * - High:   2 Low + 4 Medium + 6 High = 12 questions (ordered Low -> Medium -> High)
   * - All:    5 Low + 5 Medium + 6 High = 16 questions (ordered Low -> Medium -> High)
   */
  getQuestionsForTrack(
    trackId: QuizTrackId,
    difficulty: DifficultyFilter = 'All',
    onlyIds?: string[]
  ): QuizQuestion[] {
    const trackPool = this.questions.filter((q) => q.trackId === trackId);
    if (onlyIds && onlyIds.length > 0) {
      const idSet = new Set(onlyIds);
      const filteredByIds = trackPool.filter((q) => idSet.has(q.id));
      if (filteredByIds.length > 0) {
        return filteredByIds;
      }
    }

    const low = trackPool.filter((q) => q.difficulty === 'Low');
    const med = trackPool.filter((q) => q.difficulty === 'Medium');
    const high = trackPool.filter((q) => q.difficulty === 'High');

    switch (difficulty) {
      case 'Low':
        return low.slice(0, 5);
      case 'Medium':
        return [...low.slice(0, 3), ...med.slice(0, 5)];
      case 'High':
        return [...low.slice(0, 2), ...med.slice(0, 4), ...high.slice(0, 6)];
      case 'All':
      default:
        return [...low.slice(0, 5), ...med.slice(0, 5), ...high.slice(0, 6)];
    }
  }

  getWeakTopicQuestions(limitCount = 10): QuizQuestion[] {
    const weak = this.weakTopics();
    const collected: QuizQuestion[] = [];
    const seenIds = new Set<string>();

    const appendTopicMatches = (trackId: QuizTrackId, topic: string) => {
      for (const q of this.questions) {
        if (collected.length >= limitCount) break;
        if (q.trackId === trackId && q.topic === topic && !seenIds.has(q.id)) {
          seenIds.add(q.id);
          collected.push(q);
        }
      }
    };

    for (const w of weak) {
      if (collected.length >= limitCount) break;
      appendTopicMatches(w.trackId, w.topic);
    }

    if (collected.length < limitCount && this.topicStatsSignal().length > 0) {
      const sortedAllStats = [...this.topicStatsSignal()].sort(
        (a, b) => a.correct / Math.max(1, a.total) - b.correct / Math.max(1, b.total)
      );
      for (const s of sortedAllStats) {
        if (collected.length >= limitCount) break;
        appendTopicMatches(s.trackId, s.topic);
      }
    }

    if (collected.length === 0) {
      // Graceful fallback for direct navigation to /quiz/drill before attempting runs
      const roleRecs = this.activeRoleProfile().recommendedTracks;
      const fallbackTracks = roleRecs.length > 0 ? roleRecs : (['html', 'javascript', 'typescript'] as QuizTrackId[]);
      for (const trackId of fallbackTracks) {
        for (const q of this.getQuestionsForTrack(trackId, 'Medium')) {
          if (collected.length >= limitCount) break;
          if (!seenIds.has(q.id)) {
            seenIds.add(q.id);
            collected.push(q);
          }
        }
        if (collected.length >= limitCount) break;
      }
    }

    return collected;
  }

  getDifficultyCount(trackId: QuizTrackId, difficulty: DifficultyLevel): number {
    return this.questions.filter((q) => q.trackId === trackId && q.difficulty === difficulty)
      .length;
  }

  getTrackBestAccuracy(trackId: QuizTrackId): number | null {
    const matching = this.attemptsSignal().filter((a) => a.trackId === trackId);
    if (matching.length === 0) return null;
    return Math.max(...matching.map((a) => a.accuracy));
  }

  getTrackAttemptCount(trackId: QuizTrackId): number {
    return this.attemptsSignal().filter((a) => a.trackId === trackId).length;
  }

  isBookmarked(questionId: string): boolean {
    return this.bookmarksSignal().includes(questionId);
  }

  toggleBookmark(questionId: string): void {
    let nextList: string[] = [];
    this.bookmarksSignal.update((current) => {
      const exists = current.includes(questionId);
      nextList = exists ? current.filter((id) => id !== questionId) : [...current, questionId];
      this.persistJson(STORAGE_BOOKMARKS_KEY, nextList);
      return nextList;
    });
    void this.authService.syncBookmarks(nextList);
  }

  recordTopicOutcomes(items: { question: QuizQuestion; isCorrect: boolean }[]): void {
    if (items.length === 0) return;

    const deltas = new Map<
      string,
      { trackId: QuizTrackId; category: TrackCategory; topic: string; correct: number; total: number }
    >();

    for (const item of items) {
      const track = this.getTrack(item.question.trackId);
      const id = this.buildTopicStatId(item.question.trackId, item.question.topic);
      const cur = deltas.get(id) ?? {
        trackId: item.question.trackId,
        category: track.category,
        topic: item.question.topic,
        correct: 0,
        total: 0,
      };
      cur.total += 1;
      if (item.isCorrect) cur.correct += 1;
      deltas.set(id, cur);
    }

    const updatedStatsForCloud: TopicStatRecord[] = [];
    const nowIso = new Date().toISOString();

    this.topicStatsSignal.update((current) => {
      const map = new Map<string, TopicStatRecord>(current.map((s) => [s.id, s]));
      for (const [id, delta] of deltas.entries()) {
        const existing = map.get(id);
        const nextTotal = Math.min(5000, (existing?.total ?? 0) + delta.total);
        const nextCorrect = Math.min(nextTotal, (existing?.correct ?? 0) + delta.correct);
        const record: TopicStatRecord = {
          id,
          trackId: delta.trackId,
          category: delta.category,
          topic: delta.topic,
          correct: nextCorrect,
          total: nextTotal,
          updatedAt: nowIso,
        };
        map.set(id, record);
        updatedStatsForCloud.push(record);
      }
      const nextList = Array.from(map.values());
      this.persistJson(STORAGE_TOPIC_STATS_KEY, nextList);
      return nextList;
    });

    for (const stat of updatedStatsForCloud) {
      void this.authService.upsertTopicStatToCloud(stat);
    }
  }

  saveAttempt(
    record: Omit<QuizAttemptRecord, 'id' | 'completedAt'>,
    topicItems?: { question: QuizQuestion; isCorrect: boolean }[]
  ): { attempt: QuizAttemptRecord; certificate: CertificateRecord | null } {
    const fullRecord: QuizAttemptRecord = {
      ...record,
      id: `${record.trackId}-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    this.attemptsSignal.update((current) => {
      const next = [fullRecord, ...current].slice(0, 50);
      this.persistJson(STORAGE_ATTEMPTS_KEY, next);
      return next;
    });
    void this.authService.saveAttemptToCloud(fullRecord);

    if (topicItems && topicItems.length > 0) {
      this.recordTopicOutcomes(topicItems);
    }

    let certificate: CertificateRecord | null = null;
    if (fullRecord.passed && fullRecord.accuracy >= 70) {
      certificate = this.issueCertificateForAttempt(fullRecord);
    }

    return { attempt: fullRecord, certificate };
  }

  issueCertificateForAttempt(attempt: QuizAttemptRecord): CertificateRecord {
    const profile = this.authService.profile();
    const track = this.getTrack(attempt.trackId);
    const codeSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const trackTag = attempt.trackId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

    const cert: CertificateRecord = {
      id: `cert-${attempt.trackId}-${Date.now()}`,
      userId: profile?.uid || 'local-user',
      recipientName: profile?.fullName?.trim() || 'Guest Engineer',
      recipientEmail: profile?.email?.trim() || '',
      organization: profile?.organization?.trim() || '',
      roleId: attempt.roleId,
      trackId: attempt.trackId,
      trackTitle: attempt.trackTitle,
      category: track.category,
      difficultyFilter: attempt.difficultyFilter,
      correctCount: attempt.correctCount,
      totalQuestions: attempt.totalQuestions,
      accuracy: attempt.accuracy,
      verificationCode: `SB-${trackTag}-${codeSuffix}`,
      issuedAt: attempt.completedAt,
    };

    this.certificatesSignal.update((current) => {
      const next = [cert, ...current].slice(0, 100);
      this.persistJson(STORAGE_CERTIFICATES_KEY, next);
      return next;
    });

    void this.authService.saveCertificateToCloud(cert);
    return cert;
  }

  deleteCertificate(certificateId: string): void {
    this.certificatesSignal.update((current) => {
      const next = current.filter((c) => c.id !== certificateId);
      this.persistJson(STORAGE_CERTIFICATES_KEY, next);
      return next;
    });
    void this.authService.deleteCertificateInCloud(certificateId);
  }

  clearHistory(): void {
    this.attemptsSignal.set([]);
    this.topicStatsSignal.set([]);
    this.persistJson(STORAGE_ATTEMPTS_KEY, []);
    this.persistJson(STORAGE_TOPIC_STATS_KEY, []);
    void this.authService.clearAttemptsInCloud();
    void this.authService.clearTopicStatsInCloud();
  }

  toggleTheme(): void {
    const next: ThemeMode = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(next);
    this.applyTheme(next);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_THEME_KEY, next);
    }
  }

  private buildTopicStatId(trackId: QuizTrackId, topic: string): string {
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
    return `${trackId}--${slug || 'topic'}`;
  }

  private applyTheme(theme: ThemeMode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }

  private loadAttempts(): QuizAttemptRecord[] {
    return this.readJson<QuizAttemptRecord[]>(STORAGE_ATTEMPTS_KEY, []);
  }

  private loadBookmarks(): string[] {
    return this.readJson<string[]>(STORAGE_BOOKMARKS_KEY, []);
  }

  private loadCertificates(): CertificateRecord[] {
    return this.readJson<CertificateRecord[]>(STORAGE_CERTIFICATES_KEY, []);
  }

  private loadTopicStats(): TopicStatRecord[] {
    return this.readJson<TopicStatRecord[]>(STORAGE_TOPIC_STATS_KEY, []);
  }

  private loadTheme(): ThemeMode {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    }
    return 'light';
  }

  private loadRole(): RoleId {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_ROLE_KEY) as RoleId | null;
      if (
        saved === 'all' ||
        saved === 'student' ||
        saved === 'frontend' ||
        saved === 'fullstack' ||
        saved === 'senior'
      ) {
        return saved;
      }
    }
    return 'all';
  }

  private readJson<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private persistJson(key: string, value: unknown): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }
}
