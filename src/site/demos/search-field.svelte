<script lang="ts">
	import { SearchField } from '$lib/components/search-field';

	let query = $state('');

	const members = [
		{ name: 'Amrit Mandala', role: 'Lead Architect', team: 'Design Engineering' },
		{ name: 'Alex Rivera', role: 'Frontend Engineer', team: 'Svelte Core' },
		{ name: 'Elena Chen', role: 'Product Designer', team: 'Design Systems' },
		{ name: 'Marcus Brody', role: 'Motion Designer', team: 'Physics Tokens' },
		{ name: 'Sophia Patel', role: 'Accessibility Lead', team: 'A11y Core' }
	];

	const filtered = $derived(
		members.filter(
			(m) =>
				m.name.toLowerCase().includes(query.toLowerCase()) ||
				m.role.toLowerCase().includes(query.toLowerCase()) ||
				m.team.toLowerCase().includes(query.toLowerCase())
		)
	);
</script>

<div class="demo-search-field-wrap">
	<div class="demo-box">
		<SearchField
			label="Search team directory"
			placeholder="Search by name, role, or team..."
			bind:value={query}
		/>

		<div class="demo-results">
			{#if filtered.length > 0}
				<ul>
					{#each filtered as member (member.name)}
						<li>
							<div class="member-info">
								<span class="member-name">{member.name}</span>
								<span class="member-role">{member.role}</span>
							</div>
							<span class="member-team">{member.team}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="demo-empty">
					No team members found matching "{query}".
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.demo-search-field-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		width: 100%;
		max-width: 440px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.demo-results ul {
		list-style: none;
		margin: 0;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		overflow: hidden;
	}
	.demo-results li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.625rem 0.875rem;
		border-bottom: 1px solid var(--border);
		font-size: var(--text-sm);
	}
	.demo-results li:last-child {
		border-bottom: 0;
	}
	.member-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.member-name {
		font-weight: 500;
		color: var(--foreground);
	}
	.member-role {
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.member-team {
		font-size: var(--text-xs);
		color: var(--text-muted);
		padding: 0.2rem 0.5rem;
		background: var(--surface-muted);
		border-radius: var(--radius-pill);
	}
	.demo-empty {
		padding: 1.5rem;
		text-align: center;
		font-size: var(--text-sm);
		color: var(--text-secondary);
		border: 1px dashed var(--border);
		border-radius: var(--radius-control);
	}
</style>
