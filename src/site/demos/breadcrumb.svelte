<script lang="ts">
	import { Breadcrumb } from '$lib/components/breadcrumb';
	import type { BreadcrumbItem } from '$lib/components/breadcrumb';

	let levels = $state([
		{ label: 'Workspace', href: '/' },
		{ label: 'Projects', href: '/projects' },
		{ label: 'svelte-arcui', href: '/projects/svelte-arcui' },
		{ label: 'Settings' }
	]);

	function pushCrumb() {
		if (levels.length < 6) {
			const num = levels.length + 1;
			levels.push({ label: `Sub-level ${num}` });
		}
	}

	function popCrumb() {
		if (levels.length > 2) {
			levels.pop();
		}
	}
</script>

<div class="demo-breadcrumb-wrap">
	<div class="demo-box">
		<Breadcrumb items={levels} />

		<div class="demo-actions">
			<button type="button" onclick={pushCrumb} disabled={levels.length >= 6}>
				+ Add Crumb
			</button>
			<button type="button" onclick={popCrumb} disabled={levels.length <= 2}>
				- Pop Crumb
			</button>
		</div>
	</div>
</div>

<style>
	.demo-breadcrumb-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	.demo-actions {
		display: flex;
		gap: 0.75rem;
	}
	.demo-actions button {
		padding: 0.35rem 0.75rem;
		font-size: var(--text-xs);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		color: var(--foreground);
		cursor: pointer;
	}
	.demo-actions button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
