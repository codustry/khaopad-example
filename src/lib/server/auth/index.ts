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

/**
 * Last error captured by Better Auth's logger. Diagnostic only —
 * read by /api/auth-diag to surface the real DB error in the HTTP
 * response. Reset on each Better Auth invocation by the request.
 */
export const lastAuthError: { value: unknown } = { value: null };

export function createAuth(
  d1: D1Database,
  env: { BETTER_AUTH_SECRET: string; BETTER_AUTH_URL: string },
) {
  const db = drizzle(d1, { schema });

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
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
    emailAndPassword: { enabled: true },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    user: {
      additionalFields: {
        role: { type: "string", defaultValue: "author", input: false },
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // eslint-disable-next-line no-console
            console.log("[hook] user.create.before", JSON.stringify(user, (_, v) => (v instanceof Date ? `Date(${v.toISOString()})` : v)));
            return { data: coerceDates(user) };
          },
        },
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
    logger: {
      level: "debug",
      log: (level, message, ...args) => {
        // Capture the most recent error for the diagnostic endpoint.
        if (level === "error") {
          lastAuthError.value = {
            level,
            message,
            args: args.map((a) =>
              a instanceof Error
                ? { name: a.name, message: a.message, stack: a.stack, cause: a.cause ? String(a.cause) : null }
                : a,
            ),
          };
        }
        // eslint-disable-next-line no-console
        console.log(`[better-auth:${level}] ${message}`, ...args);
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
