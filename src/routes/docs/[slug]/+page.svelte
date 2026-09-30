<script lang="ts">
	import { page } from '$app/state';
	import { getGuide } from '$site/guides';
	import { Marked } from 'marked';

	const slug = $derived(page.params.slug ?? '');
	const guide = $derived(getGuide(slug));

	const slugify = (text: string) =>
		text
			.toLowerCase()
			.replace(/<[^>]*>/g, '')
			.replace(/[`*_~[\]()]/g, '')
			.replace(/&[a-z#0-9]+;/g, '')
			.replace(/[^\p{L}\p{N}]+/gu, '-')
			.replace(/^-+|-+$/g, '') || 'section';

	/** A fresh parser per render, so the duplicate-id counter never leaks between guides. */
	function render(body: string): string {
		const seen = new Map<string, number>();
		const marked = new Marked({
			renderer: {
				// Every h2/h3 gets id + data-toc, which is all OnThisPage needs (DOM-scan, no data passed in).
				heading({ tokens, depth, text }) {
					const inner = this.parser.parseInline(tokens);
					if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
					const base = slugify(text);
					const count = seen.get(base) ?? 0;
					seen.set(base, count + 1);
					const id = count ? `${base}-${count}` : base;
					return `<h${depth} id="${id}" data-toc>${inner}</h${depth}>\n`;
				}
			}
		});
		return marked.parse(body, { async: false });
	}

	// Guide content is our own repo markdown, never user input, so {@html} is safe here.
	const html = $derived(guide ? render(guide.body) : '');
</script>

<svelte:head>
	<title>{guide ? `${guide.title} — svelteArc` : 'Not found — svelteArc'}</title>
</svelte:head>

<section class="page-inside">
	{#if guide}
		<header class="site-page-head">
			<div class="box gap-sm">
				<h1 class="text-5xl weight-600 lh11">{guide.title}</h1>
				{#if guide.description}<p class="text-secondary text-bs lh11">{guide.description}</p>{/if}
			</div>
		</header>
		<article class="article-area">{@html html}</article>
	{:else}
		<header class="page-head">
			<div>
				<h1>Not found</h1>
				<p>No guide named <code>{slug}</code> yet.</p>
			</div>
		</header>
	{/if}
</section>