import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { QuizService, RoleId } from '../services/quiz.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  readonly quizService = inject(QuizService);
  readonly authService = inject(AuthService);
  readonly heroImageFailed = signal(false);
  readonly failedTrackImages = signal<Record<string, boolean>>({});

  readonly progressionTiers = [
    {
      level: 'Low',
      questions: 5,
      summary: 'Core concepts, syntax semantics, and foundational mental models.',
    },
    {
      level: 'Medium',
      questions: 8,
      summary: '3 Low warmups + 5 Medium practical debugging and runtime trade-offs.',
    },
    {
      level: 'High',
      questions: 12,
      summary: '2 Low + 4 Medium + 6 High production architecture, scaling, and edge cases.',
    },
    {
      level: 'All',
      questions: 16,
      summary: 'Complete 5 Low → 5 Medium → 6 High progressive technical benchmark.',
    },
  ];

  readonly displayedTracks = computed(() => {
    const role = this.quizService.selectedRole();
    const list =
      role === 'all'
        ? this.quizService.tracks
        : this.quizService.tracks.filter((track) =>
            this.quizService.isTrackRecommendedForRole(track.id, role)
          );
    return list.slice(0, 8);
  });

  readonly matchingTrackCount = computed(() => {
    const role = this.quizService.selectedRole();
    if (role === 'all') return this.quizService.tracks.length;
    return this.quizService.tracks.filter((track) =>
      this.quizService.isTrackRecommendedForRole(track.id, role)
    ).length;
  });

  selectRole(roleId: RoleId): void {
    this.quizService.setRole(roleId);
  }

  onHeroImageError(): void {
    this.heroImageFailed.set(true);
  }

  onTrackImageError(trackId: string): void {
    this.failedTrackImages.update((current) => ({ ...current, [trackId]: true }));
  }
}
