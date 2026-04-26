import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../content/schema";

export function createAuth(
  d1: D1Database,
  env: { BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string },
) {
  const db = drizzle(d1, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
      // Better Auth's adapter looks for singular model names ("user",
      // "session", "account", "verification"). Our Drizzle schema uses
      // plural names. Pass the schema explicitly and map the names.
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // refresh daily
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "author",
          input: false,
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
