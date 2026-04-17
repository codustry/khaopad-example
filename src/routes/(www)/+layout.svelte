<script lang="ts">
	import '../../app.css';
	import * as m from '$lib/paraglide/messages';
	import { localePath, toLocale, getAlternateLocale } from '$lib/i18n';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<div class="min-h-screen flex flex-col">
	<header class="border-b border-border">
		<div class="container mx-auto px-4 py-4 flex items-center justify-between">
			<a href="/" class="text-xl font-bold">{m.site_name()}</a>
			<nav class="flex items-center gap-4 text-sm">
				<a href={localePath(toLocale(data.locale), '/blog')} class="hover:text-primary">
					{m.nav_blog()}
				</a>
				<a
					href={localePath(getAlternateLocale(toLocale(data.locale)), '/')}
					data-sveltekit-reload
					class="px-2 py-1 border border-border rounded text-xs hover:bg-muted"
				>
					{m.lang_switch()}
				</a>
			</nav>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-border py-8 text-center text-sm text-muted-foreground">
		<p>{m.footer_copyright({ year: new Date().getFullYear().toString() })}</p>
	</footer>
</div>
