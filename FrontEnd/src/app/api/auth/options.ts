import { sendRequest } from "@/utils/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
    secret: process.env.NO_SECRET,
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "KabaNoPro",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text", placeholder: "username" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            async authorize(credentials, req) {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login?`,
                    method: "POST",
                    body: {
                        username: credentials?.username,
                        password: credentials?.password,
                    },
                });

                if (res && res.data) {
                    // Any object returned will be saved in `user` property of the JWT
                    return res.data as any;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    throw new Error(res?.message as string);

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider === "credentials") {
                token.access_token = user.access_token;
                token.refresh_token = user.refresh_token;
                token.user = user.user;
            }
            return token;
        },
        async session({ session, token, user }) {
            if (token) {
                session.access_token = token.access_token;
                session.refresh_token = token.refresh_token;
                session.user = token.user;
            }
            return session; // The return type will match the one returned in `useSession()`
        },
    },
};

export default authOptions;