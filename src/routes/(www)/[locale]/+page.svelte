<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localePath, toLocale } from '$lib/i18n';
	let { data } = $props();
	const locale = $derived.by(() => toLocale(data.locale));
</script>

<!-- SEO is handled by the layout's <Seo /> component (see (www)/+layout.svelte). -->

<section class="relative overflow-hidden">
	<div class="mx-auto grid w-full max-w-5xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
		<div class="relative">
			<span
				class="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
			>
				<span class="h-px w-5 bg-current"></span>
				{m.home_eyebrow()}
			</span>

			<h1
				class="font-display mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
			>
				{m.home_title_a()}<br />
				<span class="relative inline-block">
					{m.home_title_b()}
					<svg
						aria-hidden="true"
						class="absolute -bottom-1.5 left-0 h-2 w-full text-primary"
						viewBox="0 0 220 8"
						preserveAspectRatio="none"
					>
						<path d="M2 5 Q 30 1, 60 4 T 120 4 T 180 4 T 218 4" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
					</svg>
				</span>
			</h1>

			<p class="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
				{m.home_subtitle()}
			</p>

			<div class="mt-8 flex flex-wrap items-center gap-3">
				<a
					href={localePath(locale, '/blog')}
					class="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_3px_0_0_oklch(0.145_0_0)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_oklch(0.145_0_0)] active:translate-y-0 active:shadow-[0_1px_0_0_oklch(0.145_0_0)]"
				>
					{m.home_cta_read()}
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
						<path d="M5 12h14M13 5l7 7-7 7" />
					</svg>
				</a>
				<a
					href="https://github.com/codustry/khaopad"
					target="_blank"
					rel="noopener"
					class="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-[0_3px_0_0_oklch(0.145_0_0)] transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_0_0_oklch(0.145_0_0)] active:translate-y-0 active:shadow-[0_1px_0_0_oklch(0.145_0_0)]"
				>
					{m.home_cta_about()}
				</a>
			</div>

			<div class="mt-8 flex flex-wrap gap-2">
				<span
					class="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background/80 px-3 py-1 text-xs font-semibold"
				>
					📖 {m.home_chip_articles()}
				</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background/80 px-3 py-1 text-xs font-semibold"
				>
					🌏 {m.home_chip_locales()}
				</span>
				<span
					class="inline-flex items-center gap-1.5 rounded-full border-2 border-foreground bg-background/80 px-3 py-1 text-xs font-semibold"
				>
					⚙️ {m.home_chip_open()}
				</span>
			</div>
		</div>

		<!-- Visual: stylized "wok in motion" -->
		<div class="relative">
			<div
				aria-hidden="true"
				class="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-orange-200/60"
				style="animation: float-slow 6s ease-in-out infinite;"
			></div>
			<div
				aria-hidden="true"
				class="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-green-200/60"
				style="animation: float-slow 6s ease-in-out infinite 1.2s;"
			></div>

			<div
				class="relative aspect-[5/4] overflow-hidden rounded-3xl border-2 border-foreground bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 shadow-[0_3px_0_0_oklch(0.145_0_0)]"
			>
				<!-- "wok" SVG -->
				<svg
					aria-hidden="true"
					viewBox="0 0 400 320"
					class="absolute inset-0 h-full w-full"
				>
					<!-- steam wisps -->
					<g stroke="oklch(0.6 0.05 240 / 0.5)" stroke-width="3" fill="none" stroke-linecap="round">
						<path d="M150 60 Q 145 40, 160 30 T 155 5" style="animation: float-slow 4s ease-in-out infinite;" />
						<path d="M200 70 Q 210 50, 195 35 T 210 10" style="animation: float-slow 4s ease-in-out infinite 1s;" />
						<path d="M250 60 Q 240 40, 255 30 T 245 5" style="animation: float-slow 4s ease-in-out infinite 2s;" />
					</g>
					<!-- wok body -->
					<ellipse cx="200" cy="200" rx="140" ry="40" fill="oklch(0.25 0.04 30)" stroke="oklch(0.145 0 0)" stroke-width="3" />
					<path
						d="M 60 200 Q 60 280, 200 280 Q 340 280, 340 200"
						fill="oklch(0.18 0.04 30)"
						stroke="oklch(0.145 0 0)"
						stroke-width="3"
					/>
					<!-- rice grains -->
					<g fill="oklch(0.95 0.05 90)" stroke="oklch(0.145 0 0)" stroke-width="1.5">
						<ellipse cx="160" cy="190" rx="6" ry="3" transform="rotate(-15 160 190)" />
						<ellipse cx="180" cy="180" rx="6" ry="3" transform="rotate(20 180 180)" />
						<ellipse cx="220" cy="195" rx="6" ry="3" transform="rotate(-30 220 195)" />
						<ellipse cx="240" cy="185" rx="6" ry="3" transform="rotate(10 240 185)" />
						<ellipse cx="200" cy="170" rx="6" ry="3" transform="rotate(45 200 170)" />
					</g>
					<!-- chili -->
					<path d="M 270 175 Q 290 165, 295 180 L 290 195 Q 280 200, 275 190 Z" fill="oklch(0.6 0.2 25)" stroke="oklch(0.145 0 0)" stroke-width="2" />
					<!-- spring onion -->
					<g stroke="oklch(0.55 0.15 145)" stroke-width="3" stroke-linecap="round" fill="none">
						<line x1="140" y1="190" x2="155" y2="200" />
						<line x1="225" y1="200" x2="245" y2="195" />
					</g>
				</svg>
			</div>

			<svg
				aria-hidden="true"
				class="absolute -left-10 -bottom-12 hidden h-20 w-32 text-primary sm:block"
				viewBox="0 0 130 80"
				fill="none"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				style="stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw-arrow 1.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;"
			>
				<path d="M5 70 Q 30 50, 60 55 T 115 25" />
				<path d="M115 25 L105 18 M115 25 L108 35" />
			</svg>
		</div>
	</div>
</section>

<style>
	@keyframes float-slow {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}
	@keyframes draw-arrow {
		from {
			stroke-dashoffset: 200;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
