import type { RequestHandler } from "./$types";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "$lib/server/content/schema";

/**
 * TEMPORARY diagnostic endpoint. Tries to insert a user via Drizzle
 * with the exact column shape Better Auth would produce, and surfaces
 * the raw error in the HTTP response. Delete once signup is fixed.
 */
export const POST: RequestHandler = async ({ platform }) => {
  const env = platform?.env;
  if (!env?.DB) {
    return new Response(JSON.stringify({ error: "no DB binding" }), {
      status: 500,
    });
  }
  const db = drizzle(env.DB, { schema });

  const stamp = new Date().getTime();
  const id = `diag_user_${stamp}`;
  const email = `diag-${stamp}@example.com`;

  try {
    // Mimic what Better Auth's adapter sends to db.insert(users).values(...)
    // after our coerceDates hook should have stringified the dates.
    const row = await db
      .insert(schema.users)
      .values({
        id,
        email,
        name: "Diag User",
        emailVerified: false,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    return new Response(
      JSON.stringify({ ok: true, returned: row[0] }, null, 2),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    const e = err as Error & { cause?: unknown };
    return new Response(
      JSON.stringify(
        {
          ok: false,
          name: e?.name,
          message: e?.message,
          stack: e?.stack,
          cause: e?.cause ? String(e.cause) : null,
        },
        null,
        2,
      ),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
