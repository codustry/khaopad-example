<script lang="ts">
	import '../../app.css';
	import * as m from '$lib/paraglide/messages';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

{#if !data.user}
	{@render children()}
{:else}
	<div class="min-h-screen flex">
		<!-- Sidebar -->
		<aside class="w-64 border-r border-border bg-sidebar-background p-4 flex flex-col">
			<div class="mb-8">
				<h1 class="text-lg font-bold">{m.cms_app_name()}</h1>
			</div>
			<nav class="flex-1 space-y-1">
				<a href="/dashboard" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
					{m.cms_dashboard()}
				</a>
				<a href="/articles" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
					{m.cms_articles()}
				</a>
				<a href="/media" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
					{m.cms_media()}
				</a>
				<a href="/categories" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
					{m.cms_categories()}
				</a>
				{#if data.user.role === 'super_admin' || data.user.role === 'admin'}
					<a href="/users" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
						{m.cms_users()}
					</a>
					<a href="/settings" class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm">
						{m.cms_settings()}
					</a>
				{/if}
			</nav>
			<div class="text-xs text-muted-foreground pt-4 border-t border-border">
				<p>{data.user.name}</p>
				<p class="capitalize">{data.user.role.replace('_', ' ')}</p>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 p-8">
			{@render children()}
		</main>
	</div>
{/if}
