export type { AuthProvider, AuthUser, LoginCredentials, RegisterCredentials } from './auth.interface';
export { MockAuthProvider } from './mock-auth';

// Singleton auth instance — swap MockAuthProvider for SupabaseAuthProvider here
import { MockAuthProvider } from './mock-auth';
export const auth = new MockAuthProvider();
