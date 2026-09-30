<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { activeSection, collectSections, type TocItem } from '$site/toc';

	interface Props {
		selector?: string;
	}

	let { selector = '[data-toc]' }: Props = $props();

	let items = $state<TocItem[]>([]);
	let active = $state<string | null>(null);
	let navTick = $state(0);

	afterNavigate(() => {
		navTick += 1;
	});

	$effect(() => {
		const currentSelector = selector;
		navTick;
		if (typeof document === 'undefined') return;

		const main = document.querySelector('main');
		if (!main) {
			items = [];
			active = null;
			return;
		}

		const next = collectSections(main, currentSelector);
		items = next;
		active = activeSection(next);

		const nodes = [...main.querySelectorAll(currentSelector)];
		if (nodes.length === 0) return;

		const observer = new IntersectionObserver(
			() => {
				active = activeSection(next);
			},
			{ root: null, rootMargin: '-72px 0px -55% 0px', threshold: [0, 1] }
		);
		for (const node of nodes) observer.observe(node);

		return () => observer.disconnect();
	});

	function onSelect(event: MouseEvent, id: string) {
		if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
		const target = document.getElementById(id);
		if (!target) return;
		event.preventDefault();
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
		const url = new URL(window.location.href);
		url.hash = id;
		history.replaceState(null, '', `${url.pathname}${url.search}#${id}`);
		active = id;
	}
</script>

{#if items.length > 0}
	<nav class="toc" aria-label="On this page">
		<p class="tt-u text-sm weight-500">On this page</p>
		<ol>
			{#each items as item (item.id)}
				<li style:--level={Math.max(item.level - 2, 0)}>
					<a
						href="#{item.id}"
						title={item.text}
						aria-current={active === item.id ? 'location' : undefined}
						onclick={(event) => onSelect(event, item.id)}
						class="text-md"
					>
						{item.text}
					</a>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	.toc {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	li {
		padding-left: calc(var(--level) * 12px);
	}

	a {
		display: block;
		padding: 6px 8px;
		border-radius: var(--radius-control);
		color: var(--text-secondary);
		line-height: 1.35;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	a:hover {
		color: var(--theme-color);
	}

	a:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}

	a[aria-current='location'] {
		color: var(--foreground);
		font-weight: 600;
	}
</style>
