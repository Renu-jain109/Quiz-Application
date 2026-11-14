import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CertificatePreviewComponent } from '../certificate/certificate-preview.component';
import {
  CertificateRecord,
  DifficultyFilter,
  QuizMode,
  QuizQuestion,
  QuizService,
  QuizTrack,
  QuizTrackId,
} from '../services/quiz.service';

export interface QuestionOutcome {
  question: QuizQuestion;
  selectedOption: string | null;
  status: 'correct' | 'wrong' | 'timeout';
}

@Component({
  selector: 'app-quiz-runner',
  standalone: true,
  imports: [RouterLink, CertificatePreviewComponent],
  templateUrl: './quiz-runner.component.html',
  styleUrl: './quiz-runner.component.css',
})
export class QuizRunnerComponent implements OnInit, OnDestroy {
  @Input() defaultTrackId?: QuizTrackId;

  readonly quizService = inject(QuizService);
  private readonly route = inject(ActivatedRoute);

  readonly track = signal<QuizTrack>(this.quizService.getTrack('html'));
  readonly roleId = signal(this.quizService.selectedRole());
  readonly mode = signal<QuizMode>('timed');
  readonly difficultyFilter = signal<DifficultyFilter>('All');
  readonly activeQuestions = signal<QuizQuestion[]>([]);
  readonly currentIndex = signal(0);

  readonly difficulties: DifficultyFilter[] = ['Low', 'Medium', 'High', 'All'];

  readonly selectedOption = signal<string | null>(null);
  readonly answered = signal(false);
  readonly timedOut = signal(false);
  readonly isCompleted = signal(false);
  readonly isMissedRetryRun = signal(false);
  readonly isWeakDrillRun = signal(false);
  readonly earnedCertificate = signal<CertificateRecord | null>(null);
  readonly showCertificateModal = signal(false);

  readonly countdown = signal(30);
  readonly totalElapsedSeconds = signal(0);
  readonly outcomes = signal<QuestionOutcome[]>([]);

  readonly currentQuestion = computed(() => {
    const list = this.activeQuestions();
    const idx = this.currentIndex();
    return list[idx] ?? null;
  });

  readonly activeRoleLabel = computed(
    () => this.quizService.getRoleProfile(this.roleId()).label
  );

  readonly correctCount = computed(
    () => this.outcomes().filter((o) => o.status === 'correct').length
  );
  readonly wrongCount = computed(
    () => this.outcomes().filter((o) => o.status === 'wrong').length
  );
  readonly skippedCount = computed(
    () => this.outcomes().filter((o) => o.status === 'timeout').length
  );
  readonly missedQuestions = computed(() =>
    this.outcomes()
      .filter((o) => o.status !== 'correct')
      .map((o) => o.question)
  );
  readonly accuracy = computed(() => {
    const total = this.activeQuestions().length;
    if (total === 0) return 0;
    return Math.round((this.correctCount() / total) * 100);
  });
  readonly passed = computed(() => this.accuracy() >= this.track().passThreshold);

  readonly timerPercent = computed(() =>
    Math.max(0, Math.round((this.countdown() / 30) * 100))
  );

  readonly optionLetters = ['A', 'B', 'C', 'D'];

  private timerHandle: ReturnType<typeof setInterval> | null = null;
  private elapsedHandle: ReturnType<typeof setInterval> | null = null;
  private routeSub: Subscription | null = null;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const paramTrack = params.get('trackId') as QuizTrackId | null;
      const dataTrack = this.route.snapshot.data['trackId'] as QuizTrackId | undefined;
      const resolvedTrackId: QuizTrackId =
        this.defaultTrackId ?? paramTrack ?? dataTrack ?? 'html';

      const qp = this.route.snapshot.queryParamMap;
      const modeParam = qp.get('mode');
      const diffParam = qp.get('difficulty');
      const roleParam = qp.get('role');
      const drillFlag = Boolean(this.route.snapshot.data['drillMode']) || qp.get('drill') === 'weak';

      if (
        roleParam === 'all' ||
        roleParam === 'student' ||
        roleParam === 'frontend' ||
        roleParam === 'fullstack' ||
        roleParam === 'senior'
      ) {
        this.roleId.set(roleParam);
        this.quizService.setRole(roleParam);
      } else {
        this.roleId.set(this.quizService.selectedRole());
      }

      if (drillFlag) {
        this.mode.set('practice');
        this.difficultyFilter.set('All');
        this.initWeakDrillSession();
        return;
      }

      const roleProfile = this.quizService.getRoleProfile(this.roleId());
      this.mode.set(
        modeParam === 'practice' || modeParam === 'timed'
          ? modeParam
          : roleProfile.defaultMode
      );
      this.difficultyFilter.set(this.parseDifficultyParam(diffParam, roleProfile.defaultDifficulty));

      this.initSession(resolvedTrackId);
    });
  }

  ngOnDestroy(): void {
    this.stopTimers();
    this.routeSub?.unsubscribe();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (this.isCompleted()) return;
    const tag = (event.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    const q = this.currentQuestion();
    if (!q) return;

    if (event.key >= '1' && event.key <= '4') {
      const idx = Number(event.key) - 1;
      if (!this.answered() && !this.timedOut() && q.options[idx]) {
        event.preventDefault();
        this.selectOption(q.options[idx]);
      }
      return;
    }

    if (event.key === 'Enter') {
      if (!this.answered() && !this.timedOut() && this.selectedOption()) {
        event.preventDefault();
        this.submitAnswer();
      } else if (this.answered() || this.timedOut()) {
        event.preventDefault();
        this.goToNext();
      }
      return;
    }

    if (event.key === 'b' || event.key === 'B') {
      event.preventDefault();
      this.quizService.toggleBookmark(q.id);
    }
  }

  initSession(trackId: QuizTrackId, customQuestions?: QuizQuestion[]): void {
    this.stopTimers();
    const resolvedTrack = this.quizService.getTrack(trackId);
    this.track.set(resolvedTrack);

    const list =
      customQuestions && customQuestions.length > 0
        ? customQuestions
        : this.quizService.getQuestionsForTrack(trackId, this.difficultyFilter());

    this.activeQuestions.set(list);
    this.currentIndex.set(0);
    this.selectedOption.set(null);
    this.answered.set(false);
    this.timedOut.set(false);
    this.isCompleted.set(false);
    this.isMissedRetryRun.set(Boolean(customQuestions && customQuestions.length > 0));
    this.isWeakDrillRun.set(false);
    this.earnedCertificate.set(null);
    this.showCertificateModal.set(false);
    this.outcomes.set([]);
    this.totalElapsedSeconds.set(0);

    this.startElapsedClock();
    this.startQuestionTimer();
  }

  initWeakDrillSession(): void {
    this.stopTimers();
    const list = this.quizService.getWeakTopicQuestions(10);
    const primaryTrackId = list[0]?.trackId ?? 'html';
    this.track.set(this.quizService.getTrack(primaryTrackId));
    this.mode.set('practice');

    this.activeQuestions.set(list);
    this.currentIndex.set(0);
    this.selectedOption.set(null);
    this.answered.set(false);
    this.timedOut.set(false);
    this.isCompleted.set(false);
    this.isMissedRetryRun.set(false);
    this.isWeakDrillRun.set(true);
    this.earnedCertificate.set(null);
    this.showCertificateModal.set(false);
    this.outcomes.set([]);
    this.totalElapsedSeconds.set(0);

    this.startElapsedClock();
    this.clearQuestionTimer();
  }

  switchMode(nextMode: QuizMode): void {
    if (this.mode() === nextMode) return;
    this.mode.set(nextMode);
    if (nextMode === 'practice') {
      this.clearQuestionTimer();
    } else if (!this.answered() && !this.timedOut() && !this.isCompleted()) {
      this.startQuestionTimer();
    }
  }

  switchDifficulty(nextDifficulty: DifficultyFilter): void {
    if (this.difficultyFilter() === nextDifficulty) return;
    this.difficultyFilter.set(nextDifficulty);
    this.initSession(this.track().id);
  }

  selectOption(option: string): void {
    if (this.answered() || this.timedOut()) return;
    this.selectedOption.set(option);
  }

  submitAnswer(): void {
    const q = this.currentQuestion();
    const picked = this.selectedOption();
    if (!q || !picked || this.answered() || this.timedOut()) return;

    this.clearQuestionTimer();
    this.answered.set(true);

    const isCorrect = picked === q.correctAnswer;
    this.outcomes.update((prev) => [
      ...prev,
      {
        question: q,
        selectedOption: picked,
        status: isCorrect ? 'correct' : 'wrong',
      },
    ]);
  }

  goToNext(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx < this.activeQuestions().length) {
      this.currentIndex.set(nextIdx);
      this.selectedOption.set(null);
      this.answered.set(false);
      this.timedOut.set(false);
      this.startQuestionTimer();
    } else {
      this.finishQuiz();
    }
  }

  retryFullTrack(): void {
    if (this.isWeakDrillRun()) {
      this.initWeakDrillSession();
      return;
    }
    this.initSession(this.track().id);
  }

  retryMissedOnly(): void {
    const missed = this.missedQuestions();
    if (missed.length === 0) return;
    this.initSession(this.track().id, missed);
  }

  openCertificateModal(): void {
    if (this.earnedCertificate()) {
      this.showCertificateModal.set(true);
    }
  }

  closeCertificateModal(): void {
    this.showCertificateModal.set(false);
  }

  exportReport(): void {
    if (typeof window === 'undefined') return;
    const payload = {
      platform: 'SyntaxBench',
      exportedAt: new Date().toISOString(),
      track: this.track().title,
      role: this.activeRoleLabel(),
      mode: this.mode(),
      difficultyScope: this.difficultyFilter(),
      score: `${this.correctCount()} / ${this.activeQuestions().length}`,
      accuracyPercent: this.accuracy(),
      passed: this.passed(),
      durationSeconds: this.totalElapsedSeconds(),
      items: this.outcomes().map((o) => ({
        topic: o.question.topic,
        difficulty: o.question.difficulty,
        question: o.question.question,
        selectedAnswer: o.selectedOption ?? 'Timed Out (Unanswered)',
        correctAnswer: o.question.correctAnswer,
        status: o.status,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `syntaxbench-${this.track().id}-report.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  getSegmentState(index: number): string {
    const outcome = this.outcomes()[index];
    if (outcome) return outcome.status;
    if (index === this.currentIndex() && !this.isCompleted()) return 'current';
    return 'pending';
  }

  private parseDifficultyParam(
    raw: string | null,
    fallback: DifficultyFilter
  ): DifficultyFilter {
    if (raw === 'Low' || raw === 'Medium' || raw === 'High' || raw === 'All') {
      return raw;
    }
    if (raw === 'Fundamentals') return 'Low';
    if (raw === 'Intermediate') return 'Medium';
    if (raw === 'Senior') return 'High';
    return fallback;
  }

  private finishQuiz(): void {
    this.stopTimers();
    this.isCompleted.set(true);

    const topicItems = this.outcomes().map((o) => ({
      question: o.question,
      isCorrect: o.status === 'correct',
    }));

    if (this.isWeakDrillRun()) {
      this.quizService.recordTopicOutcomes(topicItems);
      return;
    }

    if (!this.isMissedRetryRun()) {
      const { certificate } = this.quizService.saveAttempt(
        {
          trackId: this.track().id,
          trackTitle: this.track().title,
          roleId: this.roleId(),
          mode: this.mode(),
          difficultyFilter: this.difficultyFilter(),
          totalQuestions: this.activeQuestions().length,
          correctCount: this.correctCount(),
          wrongCount: this.wrongCount(),
          skippedCount: this.skippedCount(),
          accuracy: this.accuracy(),
          passed: this.passed(),
          durationSeconds: this.totalElapsedSeconds(),
        },
        topicItems
      );
      this.earnedCertificate.set(certificate);
    }
  }

  private startElapsedClock(): void {
    if (this.elapsedHandle) clearInterval(this.elapsedHandle);
    this.elapsedHandle = setInterval(() => {
      this.totalElapsedSeconds.update((s) => s + 1);
    }, 1000);
  }

  private startQuestionTimer(): void {
    this.clearQuestionTimer();
    this.countdown.set(30);
    if (this.mode() !== 'timed') return;

    this.timerHandle = setInterval(() => {
      const current = this.countdown();
      if (current > 1) {
        this.countdown.set(current - 1);
      } else {
        this.countdown.set(0);
        this.handleTimeout();
      }
    }, 1000);
  }

  private handleTimeout(): void {
    this.clearQuestionTimer();
    if (this.answered() || this.timedOut()) return;

    this.timedOut.set(true);
    const q = this.currentQuestion();
    if (q) {
      this.outcomes.update((prev) => [
        ...prev,
        {
          question: q,
          selectedOption: null,
          status: 'timeout',
        },
      ]);
    }
  }

  private clearQuestionTimer(): void {
    if (this.timerHandle) {
      clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private stopTimers(): void {
    this.clearQuestionTimer();
    if (this.elapsedHandle) {
      clearInterval(this.elapsedHandle);
      this.elapsedHandle = null;
    }
  }
}
