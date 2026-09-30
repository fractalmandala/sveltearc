<script lang="ts">
	import { page } from '$app/state';
	import { getDoc, getDemoLoader } from '$site/registry';
	import PageActions from '$site/components/PageActions.svelte';

	const slug = $derived(page.params.name ?? '');
	const doc = $derived(getDoc(slug));
	const loadDemo = $derived(getDemoLoader(slug));
	const markdownUrl = $derived(`/components/${slug}/markdown`);

	let demoTab = $state<'preview' | 'code'>('preview');
	let installTab = $state<'cli' | 'manual'>('cli');

	// Helper for CLI install command
	const cliInstall = $derived(() => {
		if (!doc) return '';
		if (typeof doc.install === 'string') return doc.install;
		return doc.install.cli ?? `pnpm add sveltearc`;
	});

	// Helper for manual install
	const manualInstall = $derived(() => {
		if (!doc || typeof doc.install === 'string') return null;
		return doc.install.manual ?? null;
	});
</script>

<section class="page-inside">
{#if doc}
	<header class="page-head">
		<div>
			<h1>{doc.title} <span class="badge">{doc.status}</span></h1>
			{#if doc.tagline}
				<blockquote class="tagline">{doc.tagline}</blockquote>
			{/if}
			<p>{doc.description}</p>
		</div>
		<PageActions slug={slug} title={doc.title} install={cliInstall()} {markdownUrl} />
	</header>

	<section class="article-area">
		<!-- Live Demo Specimen with Alt-Tab to Code View -->
	<section class="panel">
		<div class="tab-bar">
			<h2 id="live-specimen" data-toc>Live specimen</h2>
			<div style="flex: 1;"></div>
			<button
				type="button"
				class="tab-btn"
				data-active={demoTab === 'preview'}
				onclick={() => (demoTab = 'preview')}
			>
				Preview
			</button>
			<button
				type="button"
				class="tab-btn"
				data-active={demoTab === 'code'}
				onclick={() => (demoTab = 'code')}
			>
				Code
			</button>
		</div>

		{#if demoTab === 'preview'}
			{#if loadDemo}
				{#await loadDemo()}
					<p class="not-found">Loading demo…</p>
				{:then mod}
					{@const Demo = mod.default}
					<div class="demo-specimen">
						<Demo />
					</div>
				{:catch error}
					<p class="not-found">Demo failed to load: {error.message}</p>
				{/await}
			{:else}
				<p class="not-found">Demo pending.</p>
			{/if}
		{:else}
			<pre><code>{doc.demoCode ?? doc.usage}</code></pre>
		{/if}
	</section>

	<!-- When to Use / When Not to Use -->
	{#if doc.whenToUse || doc.whenNotToUse}
		<section class="panel">
			<h2 id="guidance" data-toc>Guidance</h2>
			<div class="guidance-grid">
				{#if doc.whenToUse}
					<div>
						<h3 id="when-to-use" data-toc style="margin-top: 0; font-size: var(--text-sm); color: var(--foreground);">When to use</h3>
						<ul class="bullet-list">
							{#each doc.whenToUse as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if doc.whenNotToUse}
					<div>
						<h3 id="when-not-to-use" data-toc style="margin-top: 0; font-size: var(--text-sm); color: var(--foreground);">When not to use</h3>
						<ul class="bullet-list">
							{#each doc.whenNotToUse as item}
								<li>{item}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		</section>
	{/if}

	<!-- Installation (CLI & Manual) -->
	<section class="panel">
		<div class="tab-bar">
			<h2 id="installation" data-toc>Installation</h2>
			<div style="flex: 1;"></div>
			<button
				type="button"
				class="tab-btn"
				data-active={installTab === 'cli'}
				onclick={() => (installTab = 'cli')}
			>
				CLI
			</button>
			{#if manualInstall()}
				<button
					type="button"
					class="tab-btn"
					data-active={installTab === 'manual'}
					onclick={() => (installTab = 'manual')}
				>
					Manual
				</button>
			{/if}
		</div>

		{#if installTab === 'cli'}
			<pre><code>{cliInstall()}</code></pre>
		{:else if manualInstall()}
			{@const manual = manualInstall()!}
			<div style="display: flex; flex-direction: column; gap: var(--space-4);">
				{#if manual.dependencies.length > 0}
					<div>
						<p style="margin: 0 0 var(--space-2); font-size: var(--text-sm); color: var(--text-muted);">1. Install dependencies:</p>
						<pre><code>npm install {manual.dependencies.join(' ')}</code></pre>
					</div>
				{/if}
				{#if manual.steps.length > 0}
					<div>
						<p style="margin: 0 0 var(--space-2); font-size: var(--text-sm); color: var(--text-muted);">2. Copy files and configure:</p>
						<ul class="bullet-list">
							{#each manual.steps as step}
								<li>{step}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/if}
	</section>

	<!-- Usage -->
	<section class="panel">
		<h2 id="usage" data-toc>Usage</h2>
		<pre><code>{doc.usage}</code></pre>
	</section>

	<!-- Variants / Examples -->
	{#if doc.variants && doc.variants.length > 0}
		<section class="panel">
			<h2 id="variants" data-toc>Variants & Examples</h2>
			<div style="display: flex; flex-direction: column; gap: var(--space-5);">
				{#each doc.variants as variant, index (index)}
					<div style="border-top: 1px solid var(--border); padding-top: var(--space-3);">
						<h3 id={`variant-${index}`} data-toc style="margin: 0 0 var(--space-1); font-size: var(--text-base);">{variant.name}</h3>
						{#if variant.description}
							<p style="margin: 0 0 var(--space-3); font-size: var(--text-sm); color: var(--text-secondary);">{variant.description}</p>
						{/if}
						<pre><code>{variant.code}</code></pre>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- API Reference Table -->
	<section class="panel">
		<h2 id="api-reference" data-toc>API Reference</h2>
		<table>
			<thead>
				<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
			</thead>
			<tbody>
				{#each doc.api as row}
					<tr>
						<td><code>{row.name}</code></td>
						<td><code>{row.type}</code></td>
						<td>{row.default ?? '—'}</td>
						<td>{row.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>

	<!-- Keyboard Interactions -->
	{#if doc.keyboard && doc.keyboard.length > 0}
		<section class="panel">
			<h2 id="keyboard" data-toc>Keyboard Interactions</h2>
			<table>
				<thead>
					<tr><th style="width: 200px;">Key</th><th>Action</th></tr>
				</thead>
				<tbody>
					{#each doc.keyboard as row}
						<tr>
							<td><code>{row.key}</code></td>
							<td>{row.action}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</section>
	{/if}

	<!-- Accessibility -->
	{#if doc.accessibility && doc.accessibility.length > 0}
		<section class="panel">
			<h2 id="accessibility" data-toc>Accessibility</h2>
			<ul class="bullet-list">
				{#each doc.accessibility as item}
					<li>{item}</li>
				{/each}
			</ul>
		</section>
	{/if}

	<!-- Motion -->
	<section class="panel">
		<h2 id="motion" data-toc>Motion</h2>
		<p style="margin: 0; font-size: var(--text-sm); line-height: var(--leading-body); color: var(--text-secondary);">{doc.motion}</p>
	</section>

	<!-- Notes for AI -->
	<section class="panel">
		<h2 id="notes-for-ai" data-toc>Notes for AI</h2>
		{#if doc.notesForAi && doc.notesForAi.length > 0}
			<ul class="bullet-list" style="margin-bottom: var(--space-4);">
				{#each doc.notesForAi as note}
					<li>{note}</li>
				{/each}
			</ul>
		{:else if doc.notes}
			<p style="margin: 0 0 var(--space-4); font-size: var(--text-sm); color: var(--text-secondary);">{doc.notes}</p>
		{/if}
		<p class="demo-note">Source of truth: <code>{doc.source}</code></p>
	</section>
	</section>

	<!-- Related Components -->
	{#if doc.related && doc.related.length > 0}
		<section class="panel">
			<h2 id="related" data-toc>Related Components</h2>
			<div class="related-grid">
				{#each doc.related as item}
					<a href="/components/{item.slug ?? item.name.toLowerCase()}" class="related-item">
						<strong>{item.name}</strong>
						<span>{item.description}</span>
					</a>
				{/each}
			</div>
		</section>
	{/if}
{:else}
	<header class="page-head">
		<div>
			<h1>Not found</h1>
			<p>No component documented for <code>{slug}</code> yet.</p>
		</div>
	</header>
{/if}

</section>