import type { RequestHandler } from "./$types";
import { createAuth } from "$lib/server/auth";

/**
 * TEMPORARY diagnostic endpoint. Will be removed once signup is
 * confirmed working in production.
 */
export const POST: RequestHandler = async ({ platform }) => {
  const env = platform?.env;
  if (!env?.DB || !env?.BETTER_AUTH_SECRET || !env?.BETTER_AUTH_URL) {
    return new Response(JSON.stringify({ error: "missing bindings" }), {
      status: 500,
    });
  }

  const auth = createAuth(env.DB, {
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: env.BETTER_AUTH_URL,
  });

  const stamp = Date.now();
  const email = `betterauth-${stamp}@example.com`;

  try {
    const result = await auth.api.signUpEmail({
      body: { name: "Diag", email, password: "diagpass1234" },
      asResponse: false,
    });
    return new Response(JSON.stringify({ ok: true, result }, null, 2), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const e = err as Error & { cause?: unknown; status?: number };
    return new Response(
      JSON.stringify(
        {
          ok: false,
          name: e?.name,
          message: e?.message,
          status: e?.status,
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
