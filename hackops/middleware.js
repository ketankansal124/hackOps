// File: /middleware.js
import { NextResponse } from 'next/server';
import { auth } from '@/api/lib/firebaseConfig';

export async function middleware(request) {
  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/create-profile'];
  
  // Check if the requested path is protected
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // Get the authentication token from the request
    const token = request.cookies.get('authToken')?.value;

    if (!token) {
      // Redirect to the sign-in page if no token is found
      return NextResponse.redirect(new URL('/signin', request.url));
    }

    try {
      // You would typically verify the token here
      // For Firebase, this is more complex since we can't directly use the admin SDK in middleware
      // For production, consider using a separate auth solution like NextAuth.js or implement a custom solution
      
      // For now, we'll assume the token is valid if it exists
      return NextResponse.next();
    } catch (error) {
      // If token verification fails, redirect to sign-in
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  // Allow the request to proceed for non-protected paths
  return NextResponse.next();
}

// Configure middleware to run only on specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/create-profile/:path*'],
};