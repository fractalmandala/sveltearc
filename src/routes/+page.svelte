<script lang="ts">
	import { docs, navGroups } from '$site/registry';
	import Arrow from '$site/icons/arrow-right.svelte'

	const groups = navGroups();
</script>

<section class="page-inside">
<header class="site-page-head">
	<div class="box gap-sm">
		<h1 class="text-5xl">svelteArc</h1>
		<p class="text-bs text-secondary lh15">
			Live gallery and docs for the React → Svelte port. Every component page carries a live demo, the
			props API, usage and motion notes — the doc is the proof.
		</p>
	</div>
</header>

{#each groups as group (group.id)}
	<section class="panel">
		<h2>{group.title}</h2>
		<div class="cards">
			{#each group.items as item}
				<a class="card" href="/components/{item.slug}">
					<h3>{item.title}</h3>
					<p>{docs[item.slug].description}</p>
					<Arrow/>
				</a>
			{/each}
		</div>
	</section>
{/each}
</section>
