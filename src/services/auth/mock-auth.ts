import type { AuthProvider, AuthUser, LoginCredentials, RegisterCredentials } from './auth.interface';

const STORAGE_KEY = 'varsity-tribe-auth';

const MOCK_USER: AuthUser = {
  id: 'user_001',
  email: 'rohan@example.com',
  displayName: 'Rohan K.',
  avatarUrl: undefined,
  bio: 'BCA student exploring investing. Goal: build my first emergency fund!',
  createdAt: new Date().toISOString(),
};

export class MockAuthProvider implements AuthProvider {
  private user: AuthUser | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try { this.user = JSON.parse(stored); } catch { this.user = null; }
      }
    }
  }

  private persist() {
    if (typeof window !== 'undefined') {
      if (this.user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  async getUser(): Promise<AuthUser | null> {
    return this.user;
  }

  async login(_credentials: LoginCredentials): Promise<AuthUser> {
    // Mock: accept any credentials
    this.user = { ...MOCK_USER, email: _credentials.email };
    this.persist();
    return this.user;
  }

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    this.user = {
      ...MOCK_USER,
      id: `user_${Date.now()}`,
      email: credentials.email,
      displayName: credentials.displayName,
    };
    this.persist();
    return this.user;
  }

  async logout(): Promise<void> {
    this.user = null;
    this.persist();
  }

  async updateProfile(updates: Partial<Pick<AuthUser, 'displayName' | 'avatarUrl' | 'bio'>>): Promise<AuthUser> {
    if (!this.user) throw new Error('Not authenticated');
    this.user = { ...this.user, ...updates };
    this.persist();
    return this.user;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.user !== null;
  }
}
