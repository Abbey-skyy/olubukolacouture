import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id)
    .select('name email addresses')
    .lean();

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json({ user });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

  const { name, email, address } = await req.json();

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (name)  user.name  = name.trim();
  if (email) user.email = email.trim().toLowerCase();

  if (address) {
    const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
    if (defaultIdx >= 0) {
      Object.keys(address).forEach((k) => {
        user.addresses[defaultIdx][k] = address[k];
      });
    } else if (user.addresses.length > 0) {
      Object.keys(address).forEach((k) => {
        user.addresses[0][k] = address[k];
      });
      user.addresses[0].isDefault = true;
    } else {
      user.addresses.push({ ...address, isDefault: true, label: 'Home' });
    }
  }

  await user.save();

  return NextResponse.json({
    user: {
      name:      user.name,
      email:     user.email,
      addresses: user.addresses,
    },
  });
}
