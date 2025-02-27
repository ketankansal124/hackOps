import { NextResponse } from 'next/server';
import { db } from '@/api/lib/firebaseConfig';
import { setDoc, doc, updateDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const data = await request.json();
    const { uid, role } = data;
    
    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create profile document in the appropriate collection based on role
    const collectionName = role === 'startup' ? 'startupProfiles' : 'investorProfiles';
    await setDoc(doc(db, collectionName, uid), {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    // Update user document to indicate they have a profile
    await updateDoc(doc(db, 'users', uid), {
      hasProfile: true
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
  }
}