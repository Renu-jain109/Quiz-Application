import { Injectable, computed, signal } from '@angular/core';
import {
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import {
  CertificateRecord,
  DifficultyFilter,
  ExperienceLevel,
  QuizAttemptRecord,
  QuizMode,
  QuizTrackId,
  RoleId,
  TopicStatRecord,
  TrackCategory,
  UserProfile,
} from '../data/quiz-types';
import {
  OperationType,
  firebaseAuth,
  firestoreDb,
  handleFirestoreError,
  testFirestoreConnection,
} from './firebase-client';

const STORAGE_LOCAL_PROFILE_KEY = 'syntaxbench_local_profile_v1';

export interface ProfileDraft {
  email: string;
  fullName: string;
  roleId: RoleId;
  organization: string;
  experienceLevel: ExperienceLevel;
  bio: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly profileSignal = signal<UserProfile | null>(this.loadLocalProfile());
  private readonly firebaseUserSignal = signal<User | null>(null);
  private readonly authReadySignal = signal<boolean>(false);
  private readonly busySignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly profile = this.profileSignal.asReadonly();
  readonly firebaseUser = this.firebaseUserSignal.asReadonly();
  readonly authReady = this.authReadySignal.asReadonly();
  readonly isBusy = this.busySignal.asReadonly();
  readonly authError = this.errorSignal.asReadonly();

  readonly isSignedIn = computed(() => this.profileSignal() !== null);
  readonly isCloudSynced = computed(
    () =>
      this.profileSignal()?.authProvider === 'google' &&
      this.firebaseUserSignal() !== null &&
      this.firebaseUserSignal()?.emailVerified === true
  );

  readonly displayName = computed(() => {
    const p = this.profileSignal();
    return p?.fullName?.trim() || 'Guest';
  });

  private onSyncCallback:
    | ((data: {
        roleId?: RoleId;
        bookmarkedIds?: string[];
        attempts?: QuizAttemptRecord[];
        certificates?: CertificateRecord[];
        topicStats?: TopicStatRecord[];
      }) => void)
    | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      void testFirestoreConnection();
      onAuthStateChanged(firebaseAuth, async (user) => {
        this.firebaseUserSignal.set(user);
        if (user && user.emailVerified) {
          try {
            await this.hydrateCloudSession(user);
          } catch (err) {
            console.error('Failed to hydrate cloud profile:', err);
          }
        }
        this.authReadySignal.set(true);
      });
    } else {
      this.authReadySignal.set(true);
    }
  }

  registerSyncHandler(
    callback: (data: {
      roleId?: RoleId;
      bookmarkedIds?: string[];
      attempts?: QuizAttemptRecord[];
      certificates?: CertificateRecord[];
      topicStats?: TopicStatRecord[];
    }) => void
  ): void {
    this.onSyncCallback = callback;
  }

  clearError(): void {
    this.errorSignal.set(null);
  }

  async signInWithGoogle(
    draft?: Partial<ProfileDraft>,
    currentBookmarks: string[] = []
  ): Promise<UserProfile | null> {
    this.busySignal.set(true);
    this.errorSignal.set(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const credential = await signInWithPopup(firebaseAuth, provider);
      const user = credential.user;
      if (!user || !user.emailVerified) {
        this.errorSignal.set(
          'Google account email must be verified to sync your profile to cloud storage.'
        );
        return null;
      }

      const existing = await this.fetchProfileFromFirestore(user.uid);
      const sanitizedProfile: UserProfile = {
        uid: user.uid,
        email: (draft?.email?.trim() || user.email || existing?.email || 'learner@syntaxbench.dev').slice(
          0,
          120
        ),
        fullName: (
          draft?.fullName?.trim() ||
          existing?.fullName ||
          user.displayName ||
          'Software Engineer'
        ).slice(0, 80),
        roleId: draft?.roleId ?? existing?.roleId ?? 'fullstack',
        organization: (draft?.organization ?? existing?.organization ?? '').trim().slice(0, 100),
        experienceLevel:
          draft?.experienceLevel ?? existing?.experienceLevel ?? 'Junior (1-2 yrs)',
        bio: (draft?.bio ?? existing?.bio ?? '').trim().slice(0, 240),
        authProvider: 'google',
      };

      const mergedBookmarks = existing
        ? Array.from(new Set([...existing.bookmarks, ...currentBookmarks])).slice(0, 150)
        : currentBookmarks.slice(0, 150);

      await this.upsertProfileInFirestore(user.uid, sanitizedProfile, mergedBookmarks, !existing);

      this.profileSignal.set(sanitizedProfile);
      this.saveLocalProfile(sanitizedProfile);

      const [attempts, certificates, topicStats] = await Promise.all([
        this.fetchAttemptsFromFirestore(user.uid),
        this.fetchCertificatesFromFirestore(user.uid),
        this.fetchTopicStatsFromFirestore(user.uid),
      ]);
      this.onSyncCallback?.({
        roleId: sanitizedProfile.roleId,
        bookmarkedIds: mergedBookmarks,
        attempts,
        certificates,
        topicStats,
      });

      return sanitizedProfile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      if (!msg.includes('popup-closed-by-user')) {
        this.errorSignal.set(msg);
      }
      return null;
    } finally {
      this.busySignal.set(false);
    }
  }

  async saveProfile(draft: ProfileDraft, currentBookmarks: string[] = []): Promise<UserProfile> {
    this.busySignal.set(true);
    this.errorSignal.set(null);
    try {
      const fbUser = this.firebaseUserSignal();
      const existingProfile = this.profileSignal();
      const useCloud = fbUser !== null && fbUser.emailVerified;

      const profile: UserProfile = {
        uid: useCloud ? fbUser.uid : existingProfile?.uid || `local-${Date.now()}`,
        email: draft.email.trim().slice(0, 120),
        fullName: draft.fullName.trim().slice(0, 80),
        roleId: draft.roleId,
        organization: draft.organization.trim().slice(0, 100),
        experienceLevel: draft.experienceLevel,
        bio: draft.bio.trim().slice(0, 240),
        authProvider: useCloud ? 'google' : 'local',
        updatedAt: new Date().toISOString(),
        createdAt: existingProfile?.createdAt ?? new Date().toISOString(),
      };

      if (useCloud) {
        const cloudExisting = await this.fetchProfileFromFirestore(fbUser.uid);
        await this.upsertProfileInFirestore(
          fbUser.uid,
          profile,
          currentBookmarks.slice(0, 150),
          !cloudExisting
        );
      }

      this.profileSignal.set(profile);
      this.saveLocalProfile(profile);
      this.onSyncCallback?.({ roleId: profile.roleId });
      return profile;
    } finally {
      this.busySignal.set(false);
    }
  }

  async syncRolePreference(roleId: RoleId): Promise<void> {
    const current = this.profileSignal();
    if (!current) return;
    const updated: UserProfile = { ...current, roleId, updatedAt: new Date().toISOString() };
    this.profileSignal.set(updated);
    this.saveLocalProfile(updated);

    const fbUser = this.firebaseUserSignal();
    if (fbUser && fbUser.emailVerified && current.authProvider === 'google') {
      const path = `users/${fbUser.uid}`;
      try {
        await updateDoc(doc(firestoreDb, 'users', fbUser.uid), {
          roleId,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    }
  }

  async syncBookmarks(bookmarkedIds: string[]): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const clean = bookmarkedIds
      .filter((id) => typeof id === 'string' && id.length >= 1 && id.length <= 64)
      .slice(0, 150);
    const path = `users/${fbUser.uid}`;
    try {
      await updateDoc(doc(firestoreDb, 'users', fbUser.uid), {
        bookmarkedIds: clean,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  async saveAttemptToCloud(attempt: QuizAttemptRecord): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const safeId = attempt.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
    const path = `users/${fbUser.uid}/attempts/${safeId}`;
    try {
      await setDoc(doc(firestoreDb, 'users', fbUser.uid, 'attempts', safeId), {
        userId: fbUser.uid,
        trackId: attempt.trackId,
        trackTitle: attempt.trackTitle.slice(0, 120),
        roleId: attempt.roleId,
        mode: attempt.mode,
        difficultyFilter: attempt.difficultyFilter,
        totalQuestions: Math.max(1, Math.min(50, Math.round(attempt.totalQuestions))),
        correctCount: Math.max(0, Math.round(attempt.correctCount)),
        wrongCount: Math.max(0, Math.round(attempt.wrongCount)),
        skippedCount: Math.max(0, Math.round(attempt.skippedCount)),
        accuracy: Math.max(0, Math.min(100, Math.round(attempt.accuracy))),
        passed: Boolean(attempt.passed),
        durationSeconds: Math.max(0, Math.min(86400, Math.round(attempt.durationSeconds))),
        completedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  async clearAttemptsInCloud(): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const colPath = `users/${fbUser.uid}/attempts`;
    try {
      const snap = await getDocs(collection(firestoreDb, 'users', fbUser.uid, 'attempts'));
      if (snap.empty) return;
      const batch = writeBatch(firestoreDb);
      snap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, colPath);
    }
  }

  async deleteAttemptInCloud(attemptId: string): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const safeId = attemptId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
    const path = `users/${fbUser.uid}/attempts/${safeId}`;
    try {
      await deleteDoc(doc(firestoreDb, 'users', fbUser.uid, 'attempts', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  async saveCertificateToCloud(cert: CertificateRecord): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const safeId = cert.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
    const path = `users/${fbUser.uid}/certificates/${safeId}`;
    try {
      const totalQuestions = Math.max(1, Math.min(50, Math.round(cert.totalQuestions)));
      const correctCount = Math.max(0, Math.min(totalQuestions, Math.round(cert.correctCount)));
      const accuracy = Math.max(70, Math.min(100, Math.round(cert.accuracy)));
      await setDoc(doc(firestoreDb, 'users', fbUser.uid, 'certificates', safeId), {
        userId: fbUser.uid,
        recipientName: (cert.recipientName || 'Software Engineer').trim().slice(0, 80),
        recipientEmail: (cert.recipientEmail || '').trim().slice(0, 120),
        organization: (cert.organization || '').trim().slice(0, 100),
        roleId: cert.roleId,
        trackId: cert.trackId.slice(0, 64),
        trackTitle: cert.trackTitle.slice(0, 120),
        category: cert.category,
        difficultyFilter: cert.difficultyFilter,
        correctCount,
        totalQuestions,
        accuracy,
        verificationCode: cert.verificationCode.slice(0, 40),
        issuedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  async deleteCertificateInCloud(certificateId: string): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const safeId = certificateId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
    const path = `users/${fbUser.uid}/certificates/${safeId}`;
    try {
      await deleteDoc(doc(firestoreDb, 'users', fbUser.uid, 'certificates', safeId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  async upsertTopicStatToCloud(stat: TopicStatRecord): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const safeId = stat.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
    const path = `users/${fbUser.uid}/topicStats/${safeId}`;
    try {
      const total = Math.max(1, Math.min(5000, Math.round(stat.total)));
      const correct = Math.max(0, Math.min(total, Math.round(stat.correct)));
      await setDoc(doc(firestoreDb, 'users', fbUser.uid, 'topicStats', safeId), {
        userId: fbUser.uid,
        trackId: stat.trackId.slice(0, 64),
        category: stat.category,
        topic: stat.topic.trim().slice(0, 80),
        correct,
        total,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async clearTopicStatsInCloud(): Promise<void> {
    const fbUser = this.firebaseUserSignal();
    const current = this.profileSignal();
    if (!fbUser || !fbUser.emailVerified || current?.authProvider !== 'google') {
      return;
    }
    const colPath = `users/${fbUser.uid}/topicStats`;
    try {
      const snap = await getDocs(collection(firestoreDb, 'users', fbUser.uid, 'topicStats'));
      if (snap.empty) return;
      const batch = writeBatch(firestoreDb);
      snap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, colPath);
    }
  }

  async signOut(): Promise<void> {
    this.busySignal.set(true);
    this.errorSignal.set(null);
    try {
      if (firebaseAuth.currentUser) {
        await firebaseSignOut(firebaseAuth);
      }
      this.profileSignal.set(null);
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(STORAGE_LOCAL_PROFILE_KEY);
      }
    } finally {
      this.busySignal.set(false);
    }
  }

  private async hydrateCloudSession(user: User): Promise<void> {
    const existing = await this.fetchProfileFromFirestore(user.uid);
    const localDraft = this.loadLocalProfile();
    const resolved: UserProfile = existing
      ? {
          uid: user.uid,
          email: existing.email,
          fullName: existing.fullName,
          roleId: existing.roleId,
          organization: existing.organization,
          experienceLevel: existing.experienceLevel,
          bio: existing.bio,
          authProvider: 'google',
        }
      : {
          uid: user.uid,
          email: (user.email || localDraft?.email || 'learner@syntaxbench.dev').slice(0, 120),
          fullName: (user.displayName || localDraft?.fullName || 'Software Engineer').slice(0, 80),
          roleId: localDraft?.roleId ?? 'fullstack',
          organization: localDraft?.organization ?? '',
          experienceLevel: localDraft?.experienceLevel ?? 'Junior (1-2 yrs)',
          bio: localDraft?.bio ?? '',
          authProvider: 'google',
        };

    if (!existing) {
      await this.upsertProfileInFirestore(user.uid, resolved, [], true);
    }

    this.profileSignal.set(resolved);
    this.saveLocalProfile(resolved);
    const [attempts, certificates, topicStats] = await Promise.all([
      this.fetchAttemptsFromFirestore(user.uid),
      this.fetchCertificatesFromFirestore(user.uid),
      this.fetchTopicStatsFromFirestore(user.uid),
    ]);
    this.onSyncCallback?.({
      roleId: resolved.roleId,
      bookmarkedIds: existing?.bookmarks ?? [],
      attempts,
      certificates,
      topicStats,
    });
  }

  private async fetchProfileFromFirestore(
    uid: string
  ): Promise<(UserProfile & { bookmarks: string[] }) | null> {
    const path = `users/${uid}`;
    try {
      const snap = await getDoc(doc(firestoreDb, 'users', uid));
      if (!snap.exists()) return null;
      const data = snap.data() as Record<string, unknown>;
      return {
        uid,
        email: String(data['email'] ?? ''),
        fullName: String(data['fullName'] ?? ''),
        roleId: this.normalizeRole(data['roleId']),
        organization: String(data['organization'] ?? ''),
        experienceLevel: this.normalizeExperience(data['experienceLevel']),
        bio: String(data['bio'] ?? ''),
        authProvider: 'google',
        bookmarks: Array.isArray(data['bookmarkedIds'])
          ? (data['bookmarkedIds'] as unknown[]).filter((v): v is string => typeof v === 'string')
          : [],
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  }

  private async upsertProfileInFirestore(
    uid: string,
    profile: UserProfile,
    bookmarkedIds: string[],
    isCreate: boolean
  ): Promise<void> {
    const path = `users/${uid}`;
    const cleanBookmarks = bookmarkedIds
      .filter((id) => typeof id === 'string' && id.length >= 1 && id.length <= 64)
      .slice(0, 150);

    try {
      if (isCreate) {
        await setDoc(doc(firestoreDb, 'users', uid), {
          uid,
          email: profile.email,
          fullName: profile.fullName,
          roleId: profile.roleId,
          organization: profile.organization,
          experienceLevel: profile.experienceLevel,
          bio: profile.bio,
          bookmarkedIds: cleanBookmarks,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(firestoreDb, 'users', uid), {
          email: profile.email,
          fullName: profile.fullName,
          roleId: profile.roleId,
          organization: profile.organization,
          experienceLevel: profile.experienceLevel,
          bio: profile.bio,
          bookmarkedIds: cleanBookmarks,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(
        error,
        isCreate ? OperationType.CREATE : OperationType.UPDATE,
        path
      );
    }
  }

  private async fetchAttemptsFromFirestore(uid: string): Promise<QuizAttemptRecord[]> {
    const colPath = `users/${uid}/attempts`;
    try {
      const q = query(
        collection(firestoreDb, 'users', uid, 'attempts'),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        const ts = data['completedAt'] as { toDate?: () => Date } | undefined;
        const completedIso =
          ts && typeof ts.toDate === 'function'
            ? ts.toDate().toISOString()
            : new Date().toISOString();

        return {
          id: d.id,
          trackId: String(data['trackId'] ?? 'html') as QuizTrackId,
          trackTitle: String(data['trackTitle'] ?? 'Assessment'),
          roleId: this.normalizeRole(data['roleId']),
          mode: (data['mode'] === 'practice' ? 'practice' : 'timed') as QuizMode,
          difficultyFilter: this.normalizeDifficulty(data['difficultyFilter']),
          totalQuestions: Number(data['totalQuestions'] ?? 5),
          correctCount: Number(data['correctCount'] ?? 0),
          wrongCount: Number(data['wrongCount'] ?? 0),
          skippedCount: Number(data['skippedCount'] ?? 0),
          accuracy: Number(data['accuracy'] ?? 0),
          passed: Boolean(data['passed']),
          durationSeconds: Number(data['durationSeconds'] ?? 0),
          completedAt: completedIso,
        };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  }

  private async fetchCertificatesFromFirestore(uid: string): Promise<CertificateRecord[]> {
    const colPath = `users/${uid}/certificates`;
    try {
      const q = query(
        collection(firestoreDb, 'users', uid, 'certificates'),
        orderBy('issuedAt', 'desc'),
        limit(100)
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        const ts = data['issuedAt'] as { toDate?: () => Date } | undefined;
        const issuedIso =
          ts && typeof ts.toDate === 'function'
            ? ts.toDate().toISOString()
            : new Date().toISOString();

        return {
          id: d.id,
          userId: String(data['userId'] ?? uid),
          recipientName: String(data['recipientName'] ?? 'Software Engineer'),
          recipientEmail: String(data['recipientEmail'] ?? ''),
          organization: String(data['organization'] ?? ''),
          roleId: this.normalizeRole(data['roleId']),
          trackId: String(data['trackId'] ?? 'html') as QuizTrackId,
          trackTitle: String(data['trackTitle'] ?? 'Assessment'),
          category: this.normalizeCategory(data['category']),
          difficultyFilter: this.normalizeDifficulty(data['difficultyFilter']),
          correctCount: Number(data['correctCount'] ?? 0),
          totalQuestions: Number(data['totalQuestions'] ?? 5),
          accuracy: Number(data['accuracy'] ?? 70),
          verificationCode: String(data['verificationCode'] ?? 'SB-VERIFIED'),
          issuedAt: issuedIso,
        };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  }

  private async fetchTopicStatsFromFirestore(uid: string): Promise<TopicStatRecord[]> {
    const colPath = `users/${uid}/topicStats`;
    try {
      const q = query(collection(firestoreDb, 'users', uid, 'topicStats'), limit(300));
      const snap = await getDocs(q);
      return snap.docs.map((d) => {
        const data = d.data() as Record<string, unknown>;
        const ts = data['updatedAt'] as { toDate?: () => Date } | undefined;
        const updatedIso =
          ts && typeof ts.toDate === 'function'
            ? ts.toDate().toISOString()
            : new Date().toISOString();

        return {
          id: d.id,
          trackId: String(data['trackId'] ?? 'html') as QuizTrackId,
          category: this.normalizeCategory(data['category']),
          topic: String(data['topic'] ?? 'General'),
          correct: Number(data['correct'] ?? 0),
          total: Number(data['total'] ?? 1),
          updatedAt: updatedIso,
        };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
    }
  }

  private normalizeCategory(val: unknown): TrackCategory {
    if (
      val === 'Frontend & UI' ||
      val === 'Frameworks & A11y' ||
      val === 'Backend & APIs' ||
      val === 'Databases & Cache' ||
      val === 'Cloud & DevOps' ||
      val === 'CS, Security & AI'
    ) {
      return val;
    }
    return 'Frontend & UI';
  }

  private normalizeRole(val: unknown): RoleId {
    if (
      val === 'all' ||
      val === 'student' ||
      val === 'frontend' ||
      val === 'fullstack' ||
      val === 'senior'
    ) {
      return val;
    }
    return 'all';
  }

  private normalizeExperience(val: unknown): ExperienceLevel {
    if (
      val === 'Student / Fresher' ||
      val === 'Junior (1-2 yrs)' ||
      val === 'Mid-Level (3-5 yrs)' ||
      val === 'Senior / Lead (5+ yrs)'
    ) {
      return val;
    }
    return 'Junior (1-2 yrs)';
  }

  private normalizeDifficulty(val: unknown): DifficultyFilter {
    if (val === 'Low' || val === 'Medium' || val === 'High' || val === 'All') {
      return val;
    }
    if (val === 'Fundamentals') return 'Low';
    if (val === 'Intermediate') return 'Medium';
    if (val === 'Senior') return 'High';
    return 'All';
  }

  private loadLocalProfile(): UserProfile | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_LOCAL_PROFILE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  private saveLocalProfile(profile: UserProfile): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_LOCAL_PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }
}
