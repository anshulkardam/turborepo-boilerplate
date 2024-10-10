
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const db = new PrismaClient();

import { z } from "zod";

// Define the schema for the credentials
const credentialsSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(10, "Phone number must be at most 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
                password: { label: "Password", type: "password" }
            },
            // TODO: User credentials type from next-auth
            async authorize(credentials: any) {

                // Do zod validation, OTP validation here
                const validationresult = credentialsSchema.safeParse(credentials)
                if (!validationresult.success) {
                    const errors = validationresult.error.flatten(); // Get validation errors
                    return null;
                }
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser = await db.user.findFirst({
                    where: {
                        number: credentials.phone
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.number
                        }
                    }
                    return null;
                }

                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.phone,
                            password: hashedPassword
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch (e) {
                    console.error(e);
                }

                return null
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // TODO: can u fix the type here? Using any is bad 
        async session({ token, session }: { token: JWT, session: any }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session
        }
    }
}
