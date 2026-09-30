<script lang="ts">
	import Accordion from '$lib/components/accordion/accordion.svelte';

	const items = [
		{ title: 'What does the pilot prove?', content: answerBits },
		{ title: 'Why do closed panels stay mounted?', content: answerForce },
		{ title: 'What changes for consumers?', content: answerApi }
	];
</script>

{#snippet answerBits()}
	<p>
		Bits UI owns roles, ids, focus and keyboard. The CSS Module is verbatim, its
		<code>[data-state="open"]</code> selector keeps working untouched, and the anatomy JSON
		contract — not memory — dictated every prop wired.
	</p>
{/snippet}
{#snippet answerForce()}
	<p>
		The React original used <code>forceMount</code> so a toggle mid-animation retargets the
		spring instead of restarting it. Phase 1 keeps that mounted contract with static
		end-states; Phase 2 swaps the style carrier for motion variants with no structural edit.
	</p>
{/snippet}
{#snippet answerApi()}
	<p>
		<code>content: ReactNode</code> becomes <code>content?: Snippet</code> inside
		<code>items</code>. That is the one documented props-contract delta (see
		<code>accordion.manifest.json</code> gaps).
	</p>
{/snippet}

<div class="demo-stack">
	<Accordion {items} />
	<Accordion {items} size="lg" />
</div>

<style>
	.demo-stack {
		display: grid;
		gap: 2.5rem;
	}
</style>
