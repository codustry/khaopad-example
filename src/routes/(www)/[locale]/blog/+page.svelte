<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { formatDate } from '$lib/utils';
	import { localePath, toLocale } from '$lib/i18n';
	let { data } = $props();
	const locale = $derived.by(() => toLocale(data.locale));

	const activeCategoryName = $derived(
		data.activeCategory
			? (data.activeCategory.localizations[locale]?.name ?? data.activeCategory.slug)
			: null,
	);
	const activeTagName = $derived(
		data.activeTag ? (data.activeTag.localizations[locale]?.name ?? data.activeTag.slug) : null,
	);

	const tagsById = $derived(new Map(data.tags.map((t) => [t.id, t])));
</script>

<svelte:head>
	<title>{m.blog_title()} — {m.site_name()}</title>
</svelte:head>

<section class="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
	<header class="mb-12">
		<span
			class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
		>
			<span class="h-px w-5 bg-current"></span>
			{m.home_eyebrow()}
		</span>
		<h1 class="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
			{m.blog_title()}
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
			{m.blog_subtitle()}
		</p>
	</header>

	<form method="GET" class="mb-10 flex flex-wrap gap-2" role="search">
		<input
			type="search"
			name="q"
			value={data.q ?? ''}
			placeholder={m.blog_search_placeholder()}
			class="min-w-[220px] flex-1 rounded-full border-2 border-foreground bg-background px-4 py-2 text-sm shadow-[0_2px_0_0_oklch(0.145_0_0)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
		/>
		<button
			type="submit"
			class="rounded-full border-2 border-foreground bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_2px_0_0_oklch(0.145_0_0)] hover:-translate-y-0.5"
		>
			{m.blog_search_submit()}
		</button>
		{#if data.q}
			<a
				href={localePath(locale, '/blog')}
				class="rounded-full border-2 border-foreground bg-background px-5 py-2 text-sm font-semibold shadow-[0_2px_0_0_oklch(0.145_0_0)] hover:-translate-y-0.5"
			>
				{m.blog_search_clear()}
			</a>
		{/if}
	</form>

	{#if data.q}
		<p class="mb-6 text-sm text-muted-foreground">
			{m.blog_search_results({ count: String(data.articles.items.length), query: data.q })}
		</p>
	{/if}

	{#if activeCategoryName || activeTagName}
		<div
			class="mb-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-muted/30 px-4 py-2.5"
		>
			<span class="text-sm text-muted-foreground">
				{#if activeCategoryName}
					{m.blog_filter_category()}: <strong class="text-foreground">{activeCategoryName}</strong>
				{:else if activeTagName}
					{m.blog_filter_tag()}: <strong class="text-foreground">{activeTagName}</strong>
				{/if}
			</span>
			<a href={localePath(locale, '/blog')} class="text-sm font-medium text-primary hover:underline">
				{m.blog_filter_clear()}
			</a>
		</div>
	{/if}

	{#if data.articles.items.length === 0}
		<p class="text-muted-foreground">{m.blog_no_articles()}</p>
	{:else}
		<ol class="space-y-10">
			{#each data.articles.items as article, i (article.id)}
				{@const loc = article.localizations[locale]}
				{@const articleTags = article.tagIds
					.map((id) => tagsById.get(id))
					.filter((t): t is NonNullable<typeof t> => Boolean(t))}
				{#if loc}
					<li class="group">
						<a
							href={localePath(locale, `/blog/${article.slug}`)}
							class="grid grid-cols-[auto_1fr] items-baseline gap-4 sm:gap-6"
						>
							<span
								class="font-display text-3xl font-bold leading-none text-muted-foreground/40 transition-colors group-hover:text-primary sm:text-4xl"
								style="font-variant-numeric: tabular-nums;"
							>
								{String(i + 1).padStart(2, '0')}
							</span>
							<div class="min-w-0">
								<h2
									class="font-display text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl"
								>
									{loc.title}
								</h2>
								{#if loc.excerpt}
									<p class="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base">
										{loc.excerpt}
									</p>
								{/if}
								<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
									<time>
										{formatDate(article.publishedAt ?? article.createdAt, locale)}
									</time>
									{#each articleTags as tag (tag.id)}
										<span aria-hidden="true">·</span>
										<span>
											#{tag.localizations[locale]?.name ?? tag.slug}
										</span>
									{/each}
								</div>
							</div>
						</a>
					</li>
				{/if}
			{/each}
		</ol>
	{/if}
</section>
