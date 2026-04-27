import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../content/schema";

/**
 * Convert any Date-valued fields on a payload to ISO strings.
 *
 * Why this exists:
 *   Better Auth's internal adapter passes `createdAt` / `updatedAt` /
 *   `expiresAt` as JS `Date` objects on every create/update. Our Drizzle
 *   schema declares those columns as `text(...)` (ISO strings) so the
 *   rest of the app can read/write them as strings without timezone
 *   drama. Drizzle's text binder won't auto-stringify a Date — it
 *   serializes via `toString()`, which produces "Tue Apr 27 2026 ...",
 *   not an ISO string. The INSERT then either fails or stores garbage.
 *
 *   Coercing to ISO before the row hits the adapter fixes it without a
 *   schema migration.
 */
function coerceDates<T extends Record<string, unknown>>(row: T): T {
  const out: Record<string, unknown> = { ...row };
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (v instanceof Date) out[k] = v.toISOString();
  }
  return out as T;
}

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
    // Coerce Date → ISO string on the way into the database for every
    // model Better Auth manages. See `coerceDates` above for context.
    databaseHooks: {
      user: {
        create: { before: async (user) => ({ data: coerceDates(user) }) },
        update: { before: async (user) => ({ data: coerceDates(user) }) },
      },
      session: {
        create: { before: async (session) => ({ data: coerceDates(session) }) },
        update: { before: async (session) => ({ data: coerceDates(session) }) },
      },
      account: {
        create: { before: async (account) => ({ data: coerceDates(account) }) },
        update: { before: async (account) => ({ data: coerceDates(account) }) },
      },
      verification: {
        create: { before: async (v) => ({ data: coerceDates(v) }) },
        update: { before: async (v) => ({ data: coerceDates(v) }) },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
