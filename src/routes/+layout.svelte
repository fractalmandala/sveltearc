<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/foundation.css';
	import '$site/site.css';
	import '$site/styles/global.sass'
	import { navGroups } from '$site/registry';
	import { GUIDES } from '$site/guides';
	import { page } from '$app/state';
	import SearchTrigger from '$site/components/SearchTrigger.svelte';
	import SearchPalette from '$site/components/SearchPalette.svelte';
	import OnThisPage from '$site/components/OnThisPage.svelte';

	let { children } = $props();

	const groups = navGroups();
	const currentSlug = $derived(page.params.name ?? '');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>svelteArc</title>
</svelte:head>

<div class="app-shell">
	<header class="app-header">
		<a class="row logo-row ycenter" href="/">
			<img src="/images/svelte-arcui.png" alt="motif" class="logomotif" />
			<span class="brand-name">svelteArc</span>
		</a>
	</header>
	<section class="app-main-area">
	<aside class="app-left">
		<SearchTrigger />
		<nav class="nav-group">
			<h2 class="text-sm weight-500 text-secondary">Docs</h2>
			{#each GUIDES as guide (guide.slug)}
				<a
					class="nav-link"
					href="/docs/{guide.slug}"
					aria-current={page.url.pathname === `/docs/${guide.slug}` ? 'page' : undefined}
				>
					<span>{guide.title}</span>
				</a>
			{/each}
		</nav>
		{#each groups as group (group.id)}
			<nav class="nav-group">
				<h2 class="text-sm weight-500 text-secondary">{group.title}</h2>
				{#each group.items as item}
					<a
						class="nav-link"
						href="/components/{item.slug}"
						aria-current={currentSlug === item.slug ? 'page' : undefined}
					>
						<span>{item.title}</span>
						<span class="status-dot" data-status={item.status} title={item.status}></span>
					</a>
				{/each}
			</nav>
		{/each}
	</aside>
	
	<main class="content-section">
		{@render children()}
	</main>
	<aside class="app-right">
		<OnThisPage />
	</aside>

	</section>
	<footer class="app-footer"></footer>
</div>

<SearchPalette />
