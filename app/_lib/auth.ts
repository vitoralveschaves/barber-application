import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/app/_lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: {
    strategy: "jwt",
  },
});
