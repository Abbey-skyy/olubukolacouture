import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendAccountDeletionEmail } from '@/lib/email';

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id).select('name email');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { name, email } = user;

    await User.findByIdAndDelete(session.user.id);

    // Fire and forget — don't block deletion on email success
    sendAccountDeletionEmail(name, email).catch((err) =>
      console.error('[DELETE ACCOUNT EMAIL]', err)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE ACCOUNT]', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
