<script lang="ts">
	import ToastStack from '$lib/components/toast-stack/toast-stack.svelte';
	import ToastStackProvider from '$lib/components/toast-stack/toast-stack-provider.svelte';
	import { ToastStackStore } from '$lib/components/toast-stack/toast-stack-store.svelte';
	import type { ToastType } from '$lib/components/toast-stack/toast-stack.types';

	const store = new ToastStackStore(5000, 12);

	let position = $state<'bottom-right' | 'bottom-center' | 'bottom-left'>('bottom-right');
	let lastId = $state<string | null>(null);

	function fire(type: ToastType) {
		const titles: Record<ToastType, string> = {
			success: 'Deployed to production',
			info: 'New comment on your thread',
			warning: 'Storage is almost full',
			error: 'Build failed',
			loading: 'Uploading assets…'
		};
		lastId = store.toast({
			type,
			title: titles[type],
			description: type === 'error' ? 'See the log for details.' : undefined
		});
	}

	function fireUndo() {
		store.toast({
			title: 'Conversation deleted',
			action: {
				label: 'Undo',
				onClick: (id) => store.update(id, { title: 'Conversation restored', action: undefined })
			}
		});
	}

	function fireLoading() {
		const id = store.toast({ id: 'demo-save', type: 'loading', title: 'Saving…' });
		window.setTimeout(() => {
			store.update(id, { type: 'success', title: 'All changes saved' });
		}, 1800);
	}

	function updateLast() {
		if (lastId) store.update(lastId, { type: 'success', title: 'Updated in place' });
	}
</script>

<ToastStackProvider store={store}>
	<div class="demo-stack-wrap">
		<div class="demo-stack-buttons">
			<button type="button" class="demo-btn" onclick={() => fire('success')}>Success</button>
			<button type="button" class="demo-btn" onclick={() => fire('info')}>Info</button>
			<button type="button" class="demo-btn" onclick={() => fire('warning')}>Warning</button>
			<button type="button" class="demo-btn" onclick={() => fire('error')}>Error</button>
			<button type="button" class="demo-btn" onclick={() => fire('loading')}>Loading</button>
			<button type="button" class="demo-btn" onclick={fireUndo}>With Undo</button>
			<button type="button" class="demo-btn" onclick={fireLoading}>Loading → success</button>
			<button type="button" class="demo-btn" onclick={updateLast}>Update last</button>
			<button type="button" class="demo-btn" onclick={() => store.dismiss()}>Dismiss all</button>
		</div>
		<div class="demo-controls">
			<label>
				Position:
				<select bind:value={position}>
					<option value="bottom-right">Bottom right</option>
					<option value="bottom-center">Bottom center</option>
					<option value="bottom-left">Bottom left</option>
				</select>
			</label>
			<span>Queued: {store.count} — hover the stack to fan it out, Alt+T to focus it.</span>
		</div>
	</div>
	<ToastStack {position} />
</ToastStackProvider>

<style>
	.demo-stack-wrap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
		max-width: 36rem;
		margin-inline: auto;
	}
	.demo-stack-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.demo-btn {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		color: var(--foreground);
		font-size: var(--text-xs);
		cursor: pointer;
	}
	.demo-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.demo-controls select {
		margin-left: 0.5rem;
		background: var(--surface);
		color: var(--foreground);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		padding: 0.2rem 0.4rem;
	}
</style>
