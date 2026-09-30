<script lang="ts">
	import { docs, navGroups } from '$site/registry';

	const groups = navGroups();
</script>

<section class="page-inside">
<header class="page-head">
	<div>
		<h1>svelteArc</h1>
		<p>
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
					<h3>{item.title} <span class="badge">{item.status}</span></h3>
					<p>{docs[item.slug].description}</p>
				</a>
			{/each}
		</div>
	</section>
{/each}
</section>
