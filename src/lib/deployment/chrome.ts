/**
 * Deployment chrome registrations (#174 Step 6).
 *
 * Runs at module load from $lib/plugins/registrations — which both the
 * server AND the storefront client bundle import, so the custom home
 * renders identically across SSR and hydration (registering anywhere
 * only the server loads produces SSR-then-snap-back; see chrome.ts).
 */
import { setChrome } from "$lib/components/www/chrome";
import ExampleHome from "./ExampleHome.svelte";

setChrome({ home: ExampleHome });
