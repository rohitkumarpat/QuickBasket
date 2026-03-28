import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectToDatabase from "./lib/db"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

type CredentialsType = {
  email: string;
  password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {

        await connectToDatabase();

        const { email, password } = credentials as CredentialsType;

        if (!email || !password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role

        };
      }
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
               params: {
       scope: "openid email profile",
    },
      }

    })
  ],

  callbacks: {
  async signIn({ user, account }) {
    if (account?.provider === "google") {
      if (!user.email) {
        console.error("Google sign-in failed: missing email in Google profile");
        return false;
      }

      try {
        await connectToDatabase();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await User.create({
            name: user.name || "Google User",
            email: user.email,
            image: user.image || "",
            role: "user",
            isOAuth: true,
          });
        }

        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
       catch (err) {
        console.error("Google sign-in callback failed:", err);
        return false;
      }
    }

    return true;
  },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id,
        token.name = user.name,
        token.email = user.email,
         token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "user" | "deliveryboy" | "admin";
      }
        return session;
    }

    },

    pages: {
      signIn: "/frontend/login",
      error: "/frontend/login",
    },

    session: {
      strategy: "jwt",
      maxAge: 10 * 24 * 60 * 60, 
    },

    secret: process.env.BETTER_AUTH_SECRET,
})
