<script lang="ts">
	import { untrack } from 'svelte';
	import { ToastStackStore, provideToastStack } from './toast-stack-store.svelte';
	import type { ProviderProps } from './toast-stack.types';

	let { children, duration = 5000, limit = 12, store }: ProviderProps = $props();

	// ARC creates the store once via useState(initial); later `duration`/`limit`
	// changes are ignored. Reading the props once here matches that.
	const provided = untrack(() => store ?? new ToastStackStore(duration, limit));
	provideToastStack(provided);
</script>

{@render children?.()}
