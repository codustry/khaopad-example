<script lang="ts">
	import '../../app.css';
	import * as m from '$lib/paraglide/messages';
	import { localePath, toLocale, getAlternateLocale } from '$lib/i18n';
	import { page } from '$app/state';
	import Seo from '$lib/components/seo/Seo.svelte';
	import CookieBanner from '$lib/components/consent/CookieBanner.svelte';
	import type { PageSeo } from '$lib/seo';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
	const locale = $derived(toLocale(data.locale));

	// Each public +page.server.ts may return `seo: PageSeo`; the layout
	// reads it via $app/state and renders all SEO tags via <Seo />.
	const pageSeo = $derived((page.data.seo as PageSeo | undefined) ?? undefined);
	const seoDefaults = $derived({
		siteName: data.siteSettings?.siteName ?? m.site_name(),
		description: m.site_description(),
		image: undefined,
		twitter: undefined,
	});
</script>

<Seo seo={pageSeo} defaults={seoDefaults} {locale} />

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=Inter+Tight:wght@500;600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex min-h-screen flex-col">
	<header class="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
		<div class="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-5 sm:px-8">
			<a href={localePath(locale, '/')} class="group flex items-center gap-2.5">
				<span
					class="grid h-9 w-9 place-items-center rounded-md border-2 border-foreground bg-primary font-bold text-primary-foreground transition-transform group-hover:rotate-[-6deg]"
					aria-hidden="true"
				>
					ข
				</span>
				<span class="font-display text-base font-bold tracking-tight">{m.site_name()}</span>
			</a>

			<nav class="flex items-center gap-1 text-sm">
				{#each data.nav.primary as item (item.id)}
					<a
						href={item.href}
						class="rounded-full px-3 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
					>
						{item.label}
					</a>
				{/each}
				<a
					href={localePath(locale, '/blog')}
					class="rounded-full px-3 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
				>
					{m.nav_blog()}
				</a>
				<a
					href={localePath(getAlternateLocale(locale), '/')}
					data-sveltekit-reload
					class="ml-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-accent"
					aria-label={`Switch to ${getAlternateLocale(locale) === 'th' ? 'Thai' : 'English'}`}
				>
					{m.lang_switch()}
				</a>
			</nav>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-border bg-cream-soft py-10">
		<div
			class="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-5 text-sm text-muted-foreground sm:px-8"
		>
			<p>{m.footer_copyright({ year: new Date().getFullYear().toString() })}</p>

			{#if data.nav.footer.length > 0}
				<nav class="flex flex-wrap gap-4">
					{#each data.nav.footer as item (item.id)}
						<a href={item.href} class="hover:text-foreground">{item.label}</a>
					{/each}
				</nav>
			{/if}

			<a
				href="https://github.com/codustry/khaopad"
				target="_blank"
				rel="noopener"
				class="inline-flex items-center gap-1.5 hover:text-foreground"
			>
				<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"
					><path
						d="M12 .5C5.65.5.5 5.65.5 12.05c0 5.1 3.3 9.43 7.88 10.96.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.21.7-3.88-1.55-3.88-1.55-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.26-1.28-5.26-5.71 0-1.26.45-2.29 1.18-3.1-.12-.3-.51-1.49.11-3.1 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.9-.39.99 0 1.98.13 2.9.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.61.23 2.8.11 3.1.74.81 1.18 1.84 1.18 3.1 0 4.44-2.7 5.42-5.27 5.7.41.36.78 1.05.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56A11.55 11.55 0 0023.5 12.05C23.5 5.65 18.35.5 12 .5z"
					/></svg
				>
				codustry/khaopad
			</a>
		</div>
	</footer>
</div>

<!-- v1.7a cookie consent banner (first visit only). -->
<CookieBanner consent={data.consent} privacyHref={localePath(locale, '/privacy-policy')} />

<!--
	v1.8 Cloudflare Web Analytics beacon. Only loads when:
	- the operator set a token in /cms/settings, AND
	- the visitor opted in to analytics via the cookie banner.
	The first-party D1 page-view counter runs regardless.
-->
{#if data.siteSettings?.cfaToken && data.consent?.analytics}
	<script
		defer
		src="https://static.cloudflareinsights.com/beacon.min.js"
		data-cf-beacon={`{"token": "${data.siteSettings.cfaToken}"}`}
	></script>
{/if}

<style>
	:global(body) {
		font-family:
			'IBM Plex Sans Thai',
			'Inter',
			ui-sans-serif,
			system-ui,
			sans-serif;
		background-image:
			radial-gradient(circle at 8% 12%, rgb(197 242 76 / 0.18), transparent 35%),
			radial-gradient(circle at 92% 6%, rgb(255 217 181 / 0.32), transparent 30%),
			radial-gradient(circle at 50% 95%, rgb(200 230 245 / 0.28), transparent 40%);
		background-attachment: fixed;
	}
	:global(.font-display) {
		font-family: 'Inter Tight', 'Inter', ui-sans-serif, system-ui, sans-serif;
	}
	:global(.bg-cream-soft) {
		background-color: oklch(0.97 0.005 90);
	}
</style>
