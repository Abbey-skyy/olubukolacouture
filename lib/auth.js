import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from './mongodb';
import User from '@/models/User';
import { v4 as uuidv4 } from 'uuid';
import { sendVerificationEmail } from './email';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:      { label: 'Email',    type: 'email' },
        password:   { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember', type: 'text' },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) throw new Error('No account found with this email.');
        if (!user.password) throw new Error('Please use the sign-in method you registered with.');

        const valid = await user.comparePassword(credentials.password);
        if (!valid) throw new Error('Incorrect password.');

        if (!user.emailVerified) {
          throw new Error('EMAIL_NOT_VERIFIED');
        }

        return {
          id:         user._id.toString(),
          name:       user.name,
          email:      user.email,
          role:       user.role,
          image:      user.image,
          rememberMe: credentials.rememberMe === 'true',
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id         = user.id;
        token.role       = user.role;
        token.rememberMe = user.rememberMe;
      }
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id;
        session.user.role = token.role;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },

  pages: {
    signIn:  '/login',
    error:   '/login',
    newUser: '/profile',
  },

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days default
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// ── Email verification helpers ────────────────────────────────────────────────

export async function createVerificationToken(userId) {
  await connectDB();
  const token = uuidv4();
  const exp   = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
  await User.findByIdAndUpdate(userId, {
    verifyToken:    token,
    verifyTokenExp: exp,
  });
  return token;
}

export async function createPasswordResetToken(email) {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return null;
  const token = uuidv4();
  const exp   = new Date(Date.now() + 60 * 60 * 1000); // 1h
  await User.findByIdAndUpdate(user._id, {
    resetToken:    token,
    resetTokenExp: exp,
  });
  return { token, user };
}
