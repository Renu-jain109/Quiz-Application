import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth.service';
import {
  DifficultyFilter,
  QuizMode,
  QuizService,
  QuizTrack,
  RoleId,
  TrackCategory,
} from '../services/quiz.service';

type CategoryFilter = 'All' | TrackCategory;

@Component({
  selector: 'app-quiz-category',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './quiz-category.component.html',
  styleUrl: './quiz-category.component.css',
})
export class QuizCategoryComponent implements OnInit {
  readonly quizService = inject(QuizService);
  readonly authService = inject(AuthService);

  readonly categoryFilter = signal<CategoryFilter>('All');
  readonly difficultyFilter = signal<DifficultyFilter>('All');
  readonly selectedMode = signal<QuizMode>('timed');
  readonly onlyRoleRecommended = signal<boolean>(false);
  readonly failedImages = signal<Record<string, boolean>>({});

  readonly searchControl = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.searchControl.valueChanges, {
    initialValue: '',
  });

  readonly categories: CategoryFilter[] = [
    'All',
    ...this.quizService.trackCategories,
  ];
  readonly difficulties: DifficultyFilter[] = ['Low', 'Medium', 'High', 'All'];

  readonly filteredTracks = computed<QuizTrack[]>(() => {
    const category = this.categoryFilter();
    const role = this.quizService.selectedRole();
    const roleOnly = this.onlyRoleRecommended();
    const term = this.searchValue().trim().toLowerCase();

    const list = this.quizService.tracks.filter((track) => {
      const matchesCategory = category === 'All' || track.category === category;
      if (!matchesCategory) return false;

      if (roleOnly && role !== 'all' && !this.quizService.isTrackRecommendedForRole(track.id, role)) {
        return false;
      }

      if (!term) return true;

      const haystack = [
        track.title,
        track.shortTitle,
        track.category,
        track.summary,
        ...track.keyTopics,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });

    if (role !== 'all') {
      return [...list].sort((a, b) => {
        const aRec = this.quizService.isTrackRecommendedForRole(a.id, role) ? 0 : 1;
        const bRec = this.quizService.isTrackRecommendedForRole(b.id, role) ? 0 : 1;
        return aRec - bRec;
      });
    }
    return list;
  });

  ngOnInit(): void {
    const profile = this.quizService.activeRoleProfile();
    this.difficultyFilter.set(profile.defaultDifficulty);
    this.selectedMode.set(profile.defaultMode);
    this.onlyRoleRecommended.set(profile.id !== 'all');
  }

  selectRole(roleId: RoleId): void {
    this.quizService.setRole(roleId);
    const profile = this.quizService.getRoleProfile(roleId);
    this.difficultyFilter.set(profile.defaultDifficulty);
    this.selectedMode.set(profile.defaultMode);
    this.onlyRoleRecommended.set(roleId !== 'all');
    this.categoryFilter.set('All');
  }

  toggleRoleRecommended(onlyRecommended: boolean): void {
    this.onlyRoleRecommended.set(onlyRecommended);
  }

  setCategory(cat: CategoryFilter): void {
    this.categoryFilter.set(cat);
  }

  setDifficulty(diff: DifficultyFilter): void {
    this.difficultyFilter.set(diff);
  }

  setMode(mode: QuizMode): void {
    this.selectedMode.set(mode);
  }

  getQuestionCountForTrack(track: QuizTrack): number {
    return this.quizService.getQuestionsForTrack(track.id, this.difficultyFilter()).length;
  }

  resetFilters(): void {
    this.quizService.setRole('all');
    this.categoryFilter.set('All');
    this.difficultyFilter.set('All');
    this.selectedMode.set('timed');
    this.onlyRoleRecommended.set(false);
    this.searchControl.setValue('');
  }

  onImageError(trackId: string): void {
    this.failedImages.update((prev) => ({ ...prev, [trackId]: true }));
  }
}
