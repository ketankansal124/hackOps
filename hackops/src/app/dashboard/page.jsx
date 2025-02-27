// File: /app/dashboard/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/api/lib/firebaseConfig';
import { useRouter } from 'next/navigation';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get user data
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (!userDoc.exists()) {
            setError('User not found');
            setLoading(false);
            return;
          }
          
          const userData = userDoc.data();
          setUser({ uid: currentUser.uid, email: currentUser.email, ...userData });
          
          // Get profile data
          const collectionName = userData.role === 'startup' ? 'startupProfiles' : 'investorProfiles';
          const profileDoc = await getDoc(doc(db, collectionName, currentUser.uid));
          
          if (profileDoc.exists()) {
            setProfile(profileDoc.data());
          }
          
          setLoading(false);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch user data');
          setLoading(false);
        }
      } else {
        // No user is signed in, redirect to sign in
        router.push('auth/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/signin');
    } catch (err) {
      console.error(err);
      setError('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="spinner mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <div className="rounded-lg bg-red-50 p-4 text-red-500">
            <h3 className="text-lg font-medium">Error</h3>
            <p>{error}</p>
            <button
              onClick={() => router.push('/signin')}
              className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Account Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> {user?.role}</p>
              <p><span className="font-medium">Account Created:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Profile Summary</h2>
            {profile ? (
              <div className="space-y-2">
                {user?.role === 'startup' ? (
                  <>
                    <p><span className="font-medium">Company:</span> {profile.companyName}</p>
                    <p><span className="font-medium">Industry:</span> {profile.industry}</p>
                    <p><span className="font-medium">Funding Stage:</span> {profile.fundingStage}</p>
                    <p><span className="font-medium">Location:</span> {profile.location}</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Name:</span> {profile.name}</p>
                    <p><span className="font-medium">Firm:</span> {profile.firmName}</p>
                    <p><span className="font-medium">Check Size:</span> {profile.checkSize}</p>
                    <p><span className="font-medium">Location:</span> {profile.location}</p>
                  </>
                )}
                <button
                  onClick={() => router.push('/edit-profile')}
                  className="mt-2 rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500">You haven't created a profile yet.</p>
                <button
                  onClick={() => router.push(`/create-profile?role=${user?.role}`)}
                  className="mt-4 rounded-lg bg-[#357AFF] px-4 py-2 text-white hover:bg-[#2E69DE]"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>

          {/* Add more dashboard sections here */}
        </div>
      </div>
    </div>
  );
}