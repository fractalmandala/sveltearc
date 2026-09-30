<script lang="ts">
	import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '$lib/components/popover';

	let open = $state(false);
</script>

<div class="demo-grid">
	<Popover bind:open>
		<PopoverTrigger class="demo-trigger">Open popover</PopoverTrigger>
		<PopoverContent>
			<p class="demo-pop-text">
				This panel is anchored to its trigger and uses ARC’s popover CSS verbatim.
			</p>
			<PopoverClose class="demo-close">Close</PopoverClose>
		</PopoverContent>
	</Popover>
	<p class="demo-note">open: <strong>{open}</strong></p>
</div>
