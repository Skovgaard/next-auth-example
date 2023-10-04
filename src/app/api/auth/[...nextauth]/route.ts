import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// https://github.com/lawrencecchen/next-auth-refresh-tokens/blob/main/pages/api/auth/%5B...nextauth%5D.js
// https://next-auth.js.org/v3/tutorials/refresh-token-rotation
// Console Ninja
// TypeScript: https://next-auth.js.org/getting-started/typescript

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        /*
          Call api for auth
          Returns:
          -AccessToken 
          -Expires 
          -RefreshToken
          -User 
        */

        if (
          process.env.LOGIN_USERNAME === credentials?.username &&
          process.env.LOGIN_PASSWORD === credentials?.password
        ) {
          const user = {
            id: "1",
            name: "Admin",
            email: "admin@admin.com",
            accessToken: "accessToken42",
            accessTokenExpires: Date.now()
          };
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin

      // if (account) {
      //   token.accessToken = account.access_token;
      // }
      // return token;

      // console.log(token);
      // console.log(user);
      // console.log(account);

      // console.log(user?.accessTokenExpires);
      

      if (user) {
        return {
          accessToken: "account.access_token",
          refreshToken: "account.refresh_token",
          // accessTokenExpires: (account.expires_at as number) * 1000,
          accessTokenExpires: user.accessTokenExpires,
          user,
        };
      }

      // TODO: Check if it should update earlier


      // Return previous token if the access token has not expired yet
      if (Date.now() < <number>token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.

      // session.accessToken = token.accessToken;
      // return session;

      // console.log(session);
      // console.log(token);
      // console.log(user);

      session.user = token.user;
      session.accessTokenExpires = token.accessTokenExpires as number;
      session.accessToken = token.accessToken as string;

      console.log(session);

      // eslint-disable-next-line
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token: JWT) {
  console.log(
    "refreshAccessTokenrefreshAccessTokenrefreshAccessTokenrefreshAccessTokenrefreshAccessTokenrefreshAccessToken"
  );

  try {
    const url: string = "REFRESH_TOKEN_ENDPOINT" as string;

    // const params: RefreshParams = {
    //   client_id: AZURE_AD_CLIENT_ID as string,
    //   client_secret: AZURE_AD_CLIENT_SECRET as string,
    //   grant_type: "refresh_token",
    //   refresh_token: <string>token.refreshToken,
    // };

    // const response = await fetch(url, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   method: "POST",
    //   body: new URLSearchParams({ ...params }),
    // });

    // const refreshedTokens = await response.json();

    // if (!response.ok) {
    //   throw refreshedTokens;
    // }

    /*
      Api call to endpoint for new token
    */

    const timeString =
      new Date().getMinutes() + "M" + new Date().getSeconds() + "S";

    const refreshedTokens = {
      access_token: "access_token" + timeString,
      expires_in: 5,
      refresh_token: "refresh_token  + timeString",
    };

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
