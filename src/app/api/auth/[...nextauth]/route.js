import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/dbconn';
import { User } from '@/models/userModel';
import { compare } from 'bcryptjs';

// Debug function to log auth events
const debug = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[AUTH] ${message}`, data || '');
  }
};

export const authOptions = {
  debug: true, // Enable debug in development
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        debug('Authorization attempt:', { email: credentials.email });
        
        try {
          await connectDB();
          
          // Find user by email or username
          const user = await User.findOne({ 
            $or: [
              { email: credentials.email },
              { username: credentials.email }
            ]
          }).select('+password');
          
          if (!user) {
            debug('No user found with email/username:', credentials.email);
            return null;
          }
          
          // Check password
          const isValid = await compare(credentials.password, user.password);
          if (!isValid) {
            debug('Invalid password for user:', user.email);
            return null;
          }
          
          debug('User authenticated successfully:', { id: user._id, email: user.email });
          
          // Return user data that will be encoded in the JWT
          return { 
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.username,
            username: user.username
          };
        } catch (error) {
          debug('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        debug('JWT callback - new sign in', { userId: user.id });
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
        // Set the access token to the JWT token (sub)
        token.accessToken = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      debug('Session callback', { token });
      if (token) {
        session.user = {
          id: token.userId,
          email: token.email,
          name: token.name,
          username: token.username
        };
        // Make sure the access token is included in the session
        session.accessToken = token.accessToken || token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async signIn(message) {
      debug('User signed in', message);
    },
    async session(message) {
      debug('Session active', message);
    },
  },
  // Add JWT callback to include token in the response
  jwt: {
    secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
    encryption: true,
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key', // Fallback for development
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    error: '/login', // Changing the error redirect to /login
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
