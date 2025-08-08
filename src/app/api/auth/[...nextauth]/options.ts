import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" }, // creates HTML for Taking Email and password
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier }, // wil find user based on email or username
              { username: credentials.identifier }, // Will get the data which is entered
            ],
          });

          if (!user) {
            throw new Error("User Not Found");
          }
          if (!user.isVerified) {
            throw new Error("Please Verify Account First");
          }
          const passwordVerify = await bcrypt.compare(
            credentials.password,
            user.password
          ); // credentials.password is used to get password which is entered rahter than credentials.identifier Which is to be remembered

          if (passwordVerify) {
            return user;
          } else {
            throw new Error("Password Entered is wrong");
          }
        } catch (err) {
          console.error(err);
          throw new Error();
        }
      },
    }), // this will create sign in page automatically
  ],
  callbacks: {
    async jwt({ token, user }) {
      //creating new fields in token from user to take value from Token
      token._id = user._id; // Redeclared the token data in Types/next-auth.d.js
      token.isVerified = user.isVerified;
      token.isAcceptingMessages = user.isAcceptingMessages;
      token.username = user.username;
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages =token.isAcceptingMessages
        session.user.username = token.username

      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in", // defines pages
  },
  session: {
    strategy: "jwt", // Defines on which Session will be based
  },
  secret: process.env.NEXTAUTH_SECRET,
};
