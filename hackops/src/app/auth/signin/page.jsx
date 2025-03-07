// File: /app/signin/page.js
"use client";

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/api/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in user with Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile to determine if profile exists and get role
      const response = await fetch(`/api/get-user-profile?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await response.json();
      
      // Redirect based on profile status
      if (userData.hasProfile) {
        router.push('/dashboard'); // User has a profile, go to dashboard
      } else {
        // User needs to create a profile
        router.push(`/create-profile?role=${userData.role}`);
      }
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Sign in to your account</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignIn} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-lg outline-none focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black rounded-lg border border-gray-200 px-4 py-3 text-lg outline-none focus:border-[#357AFF] focus:ring-1 focus:ring-[#357AFF]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-[#357AFF] focus:ring-[#357AFF]"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm font-medium text-[#357AFF] hover:text-[#2E69DE]">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-[#357AFF] hover:text-[#2E69DE]">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}