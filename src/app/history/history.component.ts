import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CertificatePreviewComponent } from '../certificate/certificate-preview.component';
import { AuthService } from '../services/auth.service';
import { CertificateRecord, QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [RouterLink, CertificatePreviewComponent],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent {
  readonly quizService = inject(QuizService);
  readonly authService = inject(AuthService);

  readonly activeTab = signal<'attempts' | 'certificates' | 'bookmarks'>('attempts');
  readonly confirmClear = signal(false);
  readonly selectedCertificate = signal<CertificateRecord | null>(null);
  readonly pendingDeleteCertId = signal<string | null>(null);

  setTab(tab: 'attempts' | 'certificates' | 'bookmarks'): void {
    this.activeTab.set(tab);
    this.pendingDeleteCertId.set(null);
  }

  requestClear(): void {
    this.confirmClear.set(true);
  }

  cancelClear(): void {
    this.confirmClear.set(false);
  }

  confirmClearHistory(): void {
    this.quizService.clearHistory();
    this.confirmClear.set(false);
  }

  openCertificate(cert: CertificateRecord): void {
    this.selectedCertificate.set(cert);
  }

  closeCertificate(): void {
    this.selectedCertificate.set(null);
  }

  requestDeleteCertificate(certId: string): void {
    this.pendingDeleteCertId.set(certId);
  }

  cancelDeleteCertificate(): void {
    this.pendingDeleteCertId.set(null);
  }

  confirmDeleteCertificate(certId: string): void {
    this.quizService.deleteCertificate(certId);
    this.pendingDeleteCertId.set(null);
    if (this.selectedCertificate()?.id === certId) {
      this.selectedCertificate.set(null);
    }
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  formatShortDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }
}
