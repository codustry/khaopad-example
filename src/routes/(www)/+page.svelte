<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localePath } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{m.site_name()} — {m.site_description()}</title>
	<meta name="description" content="{m.site_name()} — {m.site_description()}" />
</svelte:head>

<section class="container mx-auto px-4 py-16 text-center">
	<h1 class="text-4xl font-bold mb-4">{m.site_name()}</h1>
	<p class="text-xl text-muted-foreground mb-8">
		{m.site_description()}
	</p>
	<div class="flex gap-4 justify-center">
		<a
			href={localePath(data.locale as 'th' | 'en', '/blog')}
			class="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
		>
			{m.nav_blog()}
		</a>
	</div>
</section>
