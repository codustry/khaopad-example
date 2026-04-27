import type { RequestHandler } from "./$types";
import { createAuth, lastAuthError } from "$lib/server/auth";

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

  lastAuthError.value = null;

  const stamp = Date.now();
  const email = `betterauth-${stamp}@example.com`;

  let result: unknown = null;
  let topErr: unknown = null;
  try {
    result = await auth.api.signUpEmail({
      body: { name: "Diag", email, password: "diagpass1234" },
      asResponse: false,
    });
  } catch (err) {
    topErr = err instanceof Error ? { name: err.name, message: err.message } : String(err);
  }

  return new Response(
    JSON.stringify({ result, topErr, capturedLog: lastAuthError.value }, null, 2),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
};
