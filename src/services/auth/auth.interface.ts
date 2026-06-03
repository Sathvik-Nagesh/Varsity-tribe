/**
 * Auth Service Interface
 * 
 * All components interact with auth through this interface.
 * Swap MockAuthProvider → SupabaseAuthProvider with one line change.
 */

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
}

export interface AuthProvider {
  /** Get the currently authenticated user, or null */
  getUser(): Promise<AuthUser | null>;

  /** Login with email/password */
  login(credentials: LoginCredentials): Promise<AuthUser>;

  /** Register a new user */
  register(credentials: RegisterCredentials): Promise<AuthUser>;

  /** Logout the current user */
  logout(): Promise<void>;

  /** Update the user's profile */
  updateProfile(updates: Partial<Pick<AuthUser, 'displayName' | 'avatarUrl' | 'bio'>>): Promise<AuthUser>;

  /** Check if a user is authenticated */
  isAuthenticated(): Promise<boolean>;
}
