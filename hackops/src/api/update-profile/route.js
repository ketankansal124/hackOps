// File: /app/api/update-profile/route.js
import { NextResponse } from 'next/server';
import { db } from '@/api/lib/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { uid, profileData } = body;

    if (!uid || !profileData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user profile
    await updateDoc(userRef, {
      ...profileData,
      hasProfile: true,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { message: 'Profile updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}