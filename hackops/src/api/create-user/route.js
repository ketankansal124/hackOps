import { NextResponse } from 'next/server';
import { db } from '@/api/lib/firebaseConfig';
import { setDoc, doc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { uid, email, role } = await request.json();
    
    if (!uid || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', uid), {
      email,
      role,
      createdAt: new Date().toISOString(),
      hasProfile: false
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
