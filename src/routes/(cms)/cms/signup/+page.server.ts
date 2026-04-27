import { error, isRedirect, redirect } from "@sveltejs/kit";
import {
  hasAnySuperAdmin,
  promoteToSuperAdmin,
} from "$lib/server/auth/bootstrap";
import { createAuth } from "$lib/server/auth";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals, platform }) => {
  if (!locals.platformReady || !platform?.env) {
    throw error(503, "Platform not configured");
  }
  if (await hasAnySuperAdmin(platform.env.DB)) {
    // Already bootstrapped — lock the route.
    throw error(403, "Sign-up is closed. Ask an admin to invite you.");
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, platform }) => {
    // Catch-all so any uncaught throw is surfaced as a form failure
    // instead of bubbling out as a generic SvelteKit "Internal Error" 500.
    try {
      if (!platform?.env) {
        return { ok: false, error: "[guard] platform not configured" };
      }
      if (await hasAnySuperAdmin(platform.env.DB)) {
        return { ok: false, error: "[gate] sign-up closed" };
      }

      const form = await request.formData();
      const name = String(form.get("name") ?? "").trim();
      const email = String(form.get("email") ?? "").trim();
      const password = String(form.get("password") ?? "");

      if (!name || !email || password.length < 8) {
        return {
          ok: false,
          error:
            "Name, email, and a password of at least 8 characters are required.",
        };
      }

      const auth = createAuth(platform.env.DB, {
        BETTER_AUTH_SECRET: platform.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: platform.env.BETTER_AUTH_URL,
      });

      let result;
      try {
        result = await auth.api.signUpEmail({
          body: { name, email, password },
          headers: request.headers,
          asResponse: false,
        });
      } catch (err) {
        return {
          ok: false,
          error:
            "[signup] " +
            (err instanceof Error ? `${err.name}: ${err.message}` : String(err)),
        };
      }

      const userId = (result as { user?: { id?: string } } | undefined)?.user
        ?.id;
      if (!userId) {
        return {
          ok: false,
          error: "[signup] returned no user; raw=" + JSON.stringify(result),
        };
      }

      try {
        await promoteToSuperAdmin(platform.env.DB, userId);
      } catch (err) {
        return {
          ok: false,
          error:
            "[promote] " +
            (err instanceof Error ? err.message : String(err)),
        };
      }

      throw redirect(302, "/cms/login?bootstrapped=1");
    } catch (err) {
      // Re-throw redirect() so SvelteKit handles the 302.
      if (isRedirect(err)) throw err;
      return {
        ok: false,
        error:
          "[uncaught] " +
          (err instanceof Error ? `${err.name}: ${err.message}` : String(err)),
      };
    }
  },
};
