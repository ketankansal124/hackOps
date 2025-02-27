import { NextResponse } from 'next/server';
import { db } from '@/api/lib/firebaseConfig';
import { getDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const email = searchParams.get('email');
    
    if (!uid && !email) {
      return NextResponse.json({ error: 'Missing user identifier' }, { status: 400 });
    }
    
    let userData;
    
    if (uid) {
      // Get user by UID
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      userData = userDoc.data();
    } else {
      // Get user by email
      const userQuery = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      
      if (querySnapshot.empty) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      userData = querySnapshot.docs[0].data();
    }
    
    return NextResponse.json({
      uid: uid || querySnapshot.docs[0].id,
      email: userData.email,
      role: userData.role,
      hasProfile: userData.hasProfile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}
