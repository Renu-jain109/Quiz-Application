import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  DifficultyFilter,
  QuizMode,
  QuizService,
  QuizTrackId,
  RoleId,
  TrackCategory,
} from '../services/quiz.service';

@Component({
  selector: 'app-quiz-instruction',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-instruction.component.html',
  styleUrl: './quiz-instruction.component.css',
})
export class QuizInstructionComponent implements OnInit {
  readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  readonly selectedRoleId = signal<RoleId>('all');
  readonly selectedCategory = signal<'All' | TrackCategory>('All');
  readonly selectedTrackId = signal<QuizTrackId>('html');
  readonly selectedMode = signal<QuizMode>('timed');
  readonly selectedDifficulty = signal<DifficultyFilter>('All');

  readonly difficulties: DifficultyFilter[] = ['Low', 'Medium', 'High', 'All'];

  readonly visibleTracks = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.quizService.tracks;
    return this.quizService.tracks.filter((t) => t.category === cat);
  });

  ngOnInit(): void {
    const profile = this.quizService.activeRoleProfile();
    this.selectedRoleId.set(profile.id);
    this.selectedMode.set(profile.defaultMode);
    this.selectedDifficulty.set(profile.defaultDifficulty);
    if (profile.recommendedTracks.length > 0) {
      this.selectedTrackId.set(profile.recommendedTracks[0]);
    }
  }

  selectRole(roleId: RoleId): void {
    this.selectedRoleId.set(roleId);
    this.quizService.setRole(roleId);
    const profile = this.quizService.getRoleProfile(roleId);
    this.selectedMode.set(profile.defaultMode);
    this.selectedDifficulty.set(profile.defaultDifficulty);
    if (
      !profile.recommendedTracks.includes(this.selectedTrackId()) &&
      profile.recommendedTracks.length > 0
    ) {
      this.selectedTrackId.set(profile.recommendedTracks[0]);
    }
  }

  selectCategory(category: 'All' | TrackCategory): void {
    this.selectedCategory.set(category);
    const list = this.visibleTracks();
    if (list.length > 0 && !list.some((t) => t.id === this.selectedTrackId())) {
      this.selectedTrackId.set(list[0].id);
    }
  }

  selectTrack(trackId: QuizTrackId): void {
    this.selectedTrackId.set(trackId);
  }

  selectMode(mode: QuizMode): void {
    this.selectedMode.set(mode);
  }

  selectDifficulty(diff: DifficultyFilter): void {
    this.selectedDifficulty.set(diff);
  }

  launchSelected(): void {
    const track = this.quizService.getTrack(this.selectedTrackId());
    this.router.navigate([track.routePath], {
      queryParams: {
        mode: this.selectedMode(),
        difficulty: this.selectedDifficulty(),
        role: this.selectedRoleId(),
      },
    });
  }
}
