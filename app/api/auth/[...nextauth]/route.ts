import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authService } from "@/lib/auth/authService"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password")
        }

        try {
          const user = await authService.login(credentials.username, credentials.password)
          return user
        } catch (error) {
          throw new Error("Invalid username or password")
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          ...user
        }
      }
      return token
    },
    async session({ session, token }) {
      session.user = token as any
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 
