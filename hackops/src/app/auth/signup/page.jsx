// File: /app/signup/page.js
"use client";

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/api/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('startup');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, email: user.email, role })
      });

      if (!response.ok) {
        throw new Error('Failed to create user profile');
      }

      // Redirect to profile creation page
      router.push(`/create-profile?role=${role}`);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Create an account</h2>
        
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignUp} className="space-y-6">
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
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">I am a</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="startup"
                  checked={role === 'startup'}
                  onChange={() => setRole('startup')}
                  className="h-4 w-4 text-[#357AFF] focus:ring-[#357AFF]"
                />
                <span className="ml-2">Startup</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="investor"
                  checked={role === 'investor'}
                  onChange={() => setRole('investor')}
                  className="h-4 w-4 text-[#357AFF] focus:ring-[#357AFF]"
                />
                <span className="ml-2">Investor</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#357AFF] px-4 py-3 text-base font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-[#357AFF] hover:text-[#2E69DE]">
  Sign in
</Link>



        </div>
      </div>
    </div>
  );
}