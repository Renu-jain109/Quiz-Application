import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CertificateRecord, QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-certificate-preview',
  standalone: true,
  imports: [],
  templateUrl: './certificate-preview.component.html',
  styleUrl: './certificate-preview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class CertificatePreviewComponent {
  private readonly quizService = inject(QuizService);

  readonly certificate = input.required<CertificateRecord>();
  readonly closed = output<void>();

  readonly copied = signal(false);

  readonly roleLabel = computed(
    () => this.quizService.getRoleProfile(this.certificate().roleId).label
  );

  readonly levelLabel = computed(() =>
    this.quizService.getLevelShortLabel(this.certificate().difficultyFilter)
  );

  readonly recipientMetaLine = computed(() => {
    const c = this.certificate();
    const parts: string[] = [this.roleLabel() + ' Track'];
    if (c.organization.trim()) {
      parts.push(c.organization.trim());
    }
    if (c.recipientEmail.trim()) {
      parts.push(c.recipientEmail.trim());
    }
    return parts.join(' · ');
  });

  readonly formattedDate = computed(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(this.certificate().issuedAt));
    } catch {
      return this.certificate().issuedAt;
    }
  });

  onEscape(): void {
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }

  printPdf(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  async copyVerificationCode(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(this.certificate().verificationCode);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      // Ignore clipboard permission denials gracefully
    }
  }
}
