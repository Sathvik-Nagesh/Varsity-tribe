import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Validates the user session.
 * 
 * NOTE: Currently a placeholder. 
 * Expected in Sprint C:
 * Integrate Supabase JWT validation here.
 * - Read Supabase auth cookies or Authorization header
 * - Validate the JWT signature with Supabase
 * - Return true if valid, false otherwise
 */
async function validateSession(request: NextRequest): Promise<boolean> {
  // Placeholder: Always returns true to allow access during early development
  return true;
}

export async function middleware(request: NextRequest) {
  // The matcher below ensures this middleware only runs on app routes, 
  // avoiding public assets, login pages, and API routes.
  
  const isAuthenticated = await validateSession(request);

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Session is valid, proceed with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect all routes by default except:
     * - /login, /register, /forgot-password (auth pages)
     * - /api/webhooks (public API routes, if any)
     * - /_next (Next.js internals)
     * - /static, /public (static assets)
     * - /favicon.ico, /robots.txt (SEO/browser files)
     */
    '/((?!login|register|forgot-password|api/webhooks|_next|static|public|favicon.ico|robots.txt).*)',
  ],
};
