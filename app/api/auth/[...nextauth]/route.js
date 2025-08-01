import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDatabase();

                const user = await Admin.findOne({ username: credentials.username });
                if (!user) throw new Error("User not found");

                if (!user.admin) throw new Error("You are not an admin");

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) throw new Error("Invalid credentials");

                return {
                    id: user._id.toString(),
                    username: user.username,
                    admin: user.admin,
                };
            },
        }),
    ],
    session: { 
        strategy: "jwt",
        maxAge: 60 * 60,
        updateAge: 60 * 15, 
    },
    callbacks: {
        async session({ session, token }) {
            session.user = {
                id: token.id,
                username: token.username,
                admin: token.admin ?? false,
            };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.admin = user.admin;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/admin/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };