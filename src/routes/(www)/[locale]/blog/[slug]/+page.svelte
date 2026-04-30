<script lang="ts">
	import { formatDate } from '$lib/utils';
	import { localePath, toLocale } from '$lib/i18n';
	import * as m from '$lib/paraglide/messages';
	let { data } = $props();
	const locale = $derived(toLocale(data.locale));
</script>

<!-- SEO is handled by the layout's <Seo /> component (full meta + Article JSON-LD). -->

<article class="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8 sm:py-16">
	<a
		href={localePath(locale, '/blog')}
		class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
	>
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</svg>
		{m.blog_title()}
	</a>

	<header class="mt-6 mb-10">
		<time class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
			{formatDate(data.publishedAt ?? data.createdAt, locale)}
		</time>
		<h1 class="font-display mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
			{data.title}
		</h1>
	</header>

	{#if data.coverMediaId}
		<img
			src={`/api/media/${data.coverMediaId}`}
			alt=""
			class="mb-10 aspect-[16/9] w-full rounded-2xl border border-border object-cover"
		/>
	{/if}

	<div
		class="prose prose-stone prose-lg max-w-none
			prose-headings:font-display prose-headings:tracking-tight
			prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-bold
			prose-h3:mt-8 prose-h3:text-xl prose-h3:font-semibold
			prose-p:leading-relaxed prose-p:text-foreground/85
			prose-a:font-medium prose-a:text-primary prose-a:underline-offset-4
			prose-strong:text-foreground
			prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:not-italic prose-blockquote:font-normal
			prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:text-foreground prose-code:before:content-[''] prose-code:after:content-['']
			prose-img:rounded-xl prose-img:border prose-img:border-border"
	>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted: server-rendered markdown from CMS -->
		{@html data.htmlContent}
	</div>

	<footer class="mt-16 border-t border-border pt-8">
		<a
			href={localePath(locale, '/blog')}
			class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
			{m.blog_title()}
		</a>
	</footer>
</article>
