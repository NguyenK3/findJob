import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

interface IAuth {
   _id?: string
   name: string
   email: string
   role?: {
      _id: string
      name: string
   }

   permission: {
      _id?: string
      name: string
      apiPath?: string
      method?: string
      module?: string
   }
}

declare module "next-auth" {
   /**
    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    */
   interface Session {
      user: IAuth
      access_token: string
      refresh_token?: string
   }
}

declare module "next-auth/jwt" {
   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
   interface JWT {
      /** OpenID ID Token */
      user: IAuth
      access_token: string
      refresh_token?: string
   }
}