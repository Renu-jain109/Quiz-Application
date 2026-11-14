import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExperienceLevel, RoleId } from '../data/quiz-types';
import { AuthService } from '../services/auth.service';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  readonly authService = inject(AuthService);
  readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  readonly experienceLevels: ExperienceLevel[] = [
    'Student / Fresher',
    'Junior (1-2 yrs)',
    'Mid-Level (3-5 yrs)',
    'Senior / Lead (5+ yrs)',
  ];

  readonly selectedRoleId = signal<RoleId>('fullstack');
  readonly statusMessage = signal<string | null>(null);
  readonly formSubmitted = signal(false);

  readonly profileForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(120)],
    }),
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(80)],
    }),
    organization: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    experienceLevel: new FormControl<ExperienceLevel>('Junior (1-2 yrs)', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(240)],
    }),
  });

  readonly activeRoleProfile = computed(() =>
    this.quizService.getRoleProfile(this.selectedRoleId())
  );

  readonly recommendedTrackTitles = computed(() => {
    const profile = this.activeRoleProfile();
    return profile.recommendedTracks
      .slice(0, 6)
      .map((id) => this.quizService.getTrack(id).shortTitle);
  });

  ngOnInit(): void {
    const existing = this.authService.profile();
    if (existing) {
      this.selectedRoleId.set(existing.roleId);
      this.profileForm.patchValue({
        email: existing.email,
        fullName: existing.fullName,
        organization: existing.organization,
        experienceLevel: existing.experienceLevel,
        bio: existing.bio,
      });
    } else {
      const currentRole = this.quizService.selectedRole();
      this.selectedRoleId.set(currentRole === 'all' ? 'fullstack' : currentRole);
    }
  }

  selectRole(roleId: RoleId): void {
    this.selectedRoleId.set(roleId);
    this.quizService.setRole(roleId);
    if (roleId === 'student') {
      this.profileForm.controls.experienceLevel.setValue('Student / Fresher');
    } else if (roleId === 'senior') {
      this.profileForm.controls.experienceLevel.setValue('Senior / Lead (5+ yrs)');
    }
  }

  async submitLocalProfile(): Promise<void> {
    this.formSubmitted.set(true);
    this.authService.clearError();
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const raw = this.profileForm.getRawValue();
    await this.authService.saveProfile(
      {
        email: raw.email,
        fullName: raw.fullName,
        roleId: this.selectedRoleId(),
        organization: raw.organization,
        experienceLevel: raw.experienceLevel,
        bio: raw.bio,
      },
      this.quizService.bookmarkedIds()
    );

    this.quizService.setRole(this.selectedRoleId());
    this.statusMessage.set(
      this.authService.isCloudSynced()
        ? 'Profile details and role preferences synced to Cloud Firestore.'
        : 'Profile saved. Redirecting to your personalized assessment tracks...'
    );

    if (!this.authService.isCloudSynced()) {
      setTimeout(() => {
        void this.router.navigate(['/quiz/category']);
      }, 650);
    }
  }

  async continueWithGoogle(): Promise<void> {
    this.authService.clearError();
    this.statusMessage.set(null);
    const raw = this.profileForm.getRawValue();
    const profile = await this.authService.signInWithGoogle(
      {
        email: raw.email.trim() || undefined,
        fullName: raw.fullName.trim() || undefined,
        roleId: this.selectedRoleId(),
        organization: raw.organization,
        experienceLevel: raw.experienceLevel,
        bio: raw.bio,
      },
      this.quizService.bookmarkedIds()
    );

    if (profile) {
      this.selectedRoleId.set(profile.roleId);
      this.profileForm.patchValue({
        email: profile.email,
        fullName: profile.fullName,
        organization: profile.organization,
        experienceLevel: profile.experienceLevel,
        bio: profile.bio,
      });
      this.statusMessage.set(
        `Signed in as ${profile.fullName} with Cloud Firestore sync enabled.`
      );
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this.statusMessage.set('Signed out cleanly from this browser session.');
    this.formSubmitted.set(false);
    this.profileForm.reset({
      email: '',
      fullName: '',
      organization: '',
      experienceLevel: 'Junior (1-2 yrs)',
      bio: '',
    });
  }

  hasError(controlName: 'email' | 'fullName'): boolean {
    const control = this.profileForm.controls[controlName];
    return control.invalid && (control.touched || this.formSubmitted());
  }
}
