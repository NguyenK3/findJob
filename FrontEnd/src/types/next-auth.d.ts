import NextAuth from "next-auth"
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
   /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
   interface Session {
      user: IUser & DefaultSession["user"]
      access_token: string
      refresh_token?: string
   }

   interface User {
      user: IUser
      access_token: string
      refresh_token?: string
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
   interface JWT {
      /** OpenID ID Token */
      user: IUser & DefaultSession["user"]
      access_token: string
      refresh_token?: string
   }

   interface User {
      user: IUser
      access_token: string
      refresh_token?: string
   }
}