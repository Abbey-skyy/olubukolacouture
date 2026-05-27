import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Newsletter from '@/models/Newsletter';
import { sendNewsletterToAll } from '@/lib/email';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const { subject, htmlContent } = await req.json();
    if (!subject || !htmlContent)
      return NextResponse.json({ error: 'Subject and content are required.' }, { status: 400 });

    await connectDB();
    const subs = await Newsletter.find({ isActive: true }).select('email').lean();
    const emails = subs.map((s) => s.email);

    const results = await sendNewsletterToAll(subject, htmlContent, emails);
    const sent    = results.filter((r) => r.status === 'fulfilled').length;
    const failed  = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ success: true, sent, failed, total: emails.length });
  } catch (err) {
    console.error('[NEWSLETTER SEND]', err);
    return NextResponse.json({ error: 'Failed to send newsletter.' }, { status: 500 });
  }
}
