<script lang="ts">
	import { docToMarkdown, aiLinks, pkgLabel } from '$site/markdown';
	import { getDoc } from '$site/registry';

	interface Props {
		slug: string;
		title: string;
		install: string;
		markdownUrl: string;
	}

	let { slug, title, install, markdownUrl }: Props = $props();

	// Derive the doc once — used for markdown serialisation and AI links.
	const doc = $derived(getDoc(slug));
	const markdown = $derived(doc ? docToMarkdown(doc, slug) : '');

	// F4: build absolute markdown URL client-side at runtime.
	// markdownUrl prop is a relative path (e.g. "/components/button/markdown").
	const absMarkdownUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}${markdownUrl}`
			: markdownUrl
	);
	// F4: AI links use the short prompt referencing the absolute URL.
	const links = $derived(doc ? aiLinks(doc, absMarkdownUrl) : []);

	// F6: derive install package manager label from the CLI string.
	const pkgSub = $derived(pkgLabel(install));

	// ── Copy-state (F2: visible after close) ─────────────────────────────────────
	type CopyKey = 'page' | 'markdown' | 'link' | 'install';
	// statusLabel is shown in the primary button and an aria-live region — persists
	// even after the dropdown closes, so the user can see confirmation (F2).
	let statusLabel = $state<string | null>(null);
	let resetTimer: ReturnType<typeof setTimeout> | null = null;

	function resetStatus() {
		if (resetTimer) clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			statusLabel = null;
		}, 2000);
	}

	/** Copy via the clipboard API; degrade gracefully (R5 — no throw, visible fallback). */
	async function writeClipboard(text: string, label: string) {
		try {
			if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
			await navigator.clipboard.writeText(text);
			statusLabel = `✓ ${label} copied`;
		} catch {
			statusLabel = 'Copy failed'; // visible fallback — no throw
		}
		resetStatus();
	}

	// ── Dropdown state ──────────────────────────────────────────────────────────
	let dropdownOpen = $state(false);
	let chevronEl = $state<HTMLButtonElement | null>(null);
	let dropdownEl = $state<HTMLDivElement | null>(null);

	function openDropdown() {
		dropdownOpen = true;
	}

	function closeDropdown() {
		dropdownOpen = false;
		// F3: return focus to the chevron when the dropdown closes
		chevronEl?.focus();
	}

	function toggleDropdown() {
		if (dropdownOpen) closeDropdown();
		else openDropdown();
	}

	// F3: Escape closes the dropdown and returns focus to chevron
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && dropdownOpen) {
			e.preventDefault();
			closeDropdown();
		}
	}

	// Close on outside click
	function handleOutsideClick(e: MouseEvent) {
		if (dropdownEl && !dropdownEl.contains(e.target as Node)) {
			dropdownOpen = false; // no focus-return on outside click
		}
	}

	// ── Page link ───────────────────────────────────────────────────────────────
	const pageUrl = $derived(
		typeof window !== 'undefined'
			? `${window.location.origin}/components/${slug}`
			: `/components/${slug}`
	);

	// Dropdown panel id for aria-controls
	// svelte-ignore state_referenced_locally
	const panelId = `pa-panel-${slug}`;
</script>

<svelte:window onclick={handleOutsideClick} onkeydown={handleKeydown} />

<!-- PageActions: matches ref-pageoptions.png -->
<div class="page-actions">
	<!-- F3: aria-live region announces copy result to screen readers -->
	<span class="pa-live" aria-live="polite" aria-atomic="true">
		{statusLabel ?? ''}
	</span>

	<!-- Primary: Copy page -->
	<button
		type="button"
		class="pa-primary"
		onclick={() => writeClipboard(markdown, 'page')}
	>
		<!-- copy icon -->
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
			<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
		</svg>
		<!-- F2: primary button shows statusLabel for ALL copy actions, not just its own -->
		{statusLabel ?? 'Copy page'}
	</button>

	<!-- Chevron toggle — F3: disclosure pattern, not role=menu -->
	<button
		type="button"
		class="pa-chevron"
		aria-label={dropdownOpen ? 'Close page options' : 'Open page options'}
		aria-expanded={dropdownOpen}
		aria-controls={panelId}
		bind:this={chevronEl}
		onclick={toggleDropdown}
	>
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.5"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class:rotated={dropdownOpen}
		>
			<polyline points="18 15 12 9 6 15"></polyline>
		</svg>
	</button>

	<!-- Dropdown panel — F3: plain disclosure list, no role="menu" -->
	{#if dropdownOpen}
		<div class="pa-dropdown" id={panelId} bind:this={dropdownEl}>
			<!-- Copy page as Markdown -->
			<button
				type="button"
				class="pa-item"
				onclick={() => { writeClipboard(markdown, 'page as Markdown'); closeDropdown(); }}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
					<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
				</svg>
				<span class="pa-item-text">
					<span class="pa-item-label">Copy page as Markdown</span>
					<span class="pa-item-sub">For LLMs and notes</span>
				</span>
			</button>

			<!-- View as Markdown (opens new tab) -->
			<a
				href={markdownUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="pa-item"
				onclick={closeDropdown}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
				<span class="pa-item-text">
					<span class="pa-item-label">View as Markdown</span>
					<span class="pa-item-sub">Plain text reference</span>
				</span>
				<svg class="pa-external" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<line x1="7" y1="17" x2="17" y2="7"></line>
					<polyline points="7 7 17 7 17 17"></polyline>
				</svg>
			</a>

			<!-- Copy page link -->
			<button
				type="button"
				class="pa-item"
				onclick={() => { writeClipboard(pageUrl, 'link'); closeDropdown(); }}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
				</svg>
				<span class="pa-item-text">
					<span class="pa-item-label">Copy page link</span>
				</span>
			</button>

			<!-- Copy install command — F6: subtitle derived from CLI token -->
			<button
				type="button"
				class="pa-item"
				onclick={() => { writeClipboard(install, 'install command'); closeDropdown(); }}
			>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<polyline points="4 17 10 11 4 5"></polyline>
					<line x1="12" y1="19" x2="20" y2="19"></line>
				</svg>
				<span class="pa-item-text">
					<span class="pa-item-label">Copy install command</span>
					<span class="pa-item-sub">{pkgSub}</span>
				</span>
			</button>

			<!-- AI section separator -->
			<div class="pa-section-label" aria-hidden="true">Ask about this component</div>

			<!-- AI links — F4: short prompt, absolute URL built at render time -->
			{#each links as link}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="pa-item pa-ai-item"
					onclick={closeDropdown}
				>
					{#if link.iconId === 'chatgpt'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.075.075 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.4-.679zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
						</svg>
					{:else if link.iconId === 'claude'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-1.385-.097-.225.048-.354.322.016.208.16.209.853.273 1.746.418 1.442.338.338.048zm6.622-4.122l.225.048.354.161.547.869.337 1.096.579 1.756.225.724.193.691.354.5.418.161.354-.06.209-.256v-.884l-.048-.611-.177-1.225-.241-1.418-.257-1.049-.032-.16.16-.048h.162l1.561.128 1.48.161 1.3.08.612-.048.354-.161.145-.338-.081-.305-.322-.257-.805-.224-1.979-.289-2.28-.257h-.129zm-5.35 7.81l.337.338.821.161.934-.129 2.069-.596 1.851-.547 1.037-.337.225-.226-.048-.225-.193-.128-1.048-.08-1.804-.161-1.223-.129-.612.048-.418.257-.145.354.048.531-.032.563zm5.044-12.373l-.047-.338-.177-.386-.37-.337-.483-.177-.595.032-.772.241-.821.418-.498.354-.177.289-.032.193.161.257.612.209 1.078.112.853-.048.434-.145.193-.209.016-.306-.145-.338zm-5.77.145l-.176-.29-.386-.095-.434.064-.403.241-.306.354-.193.434-.048.499.096.499.241.418.386.321.483.161.418-.048.321-.209.241-.37.16-.547.048-.547-.16-.547-.29-.418zm14.207 3.635l-.047-.338-.177-.386-.37-.337-.483-.177-.595.032-.772.241-.821.418-.498.354-.177.289-.032.193.161.257.612.209 1.078.112.853-.048.434-.145.193-.209.016-.306-.145-.338z"/>
						</svg>
					{:else if link.iconId === 'cursor'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M11.925 1.985L22 6.362v11.27l-10.075 4.383L1.85 17.632V6.362L11.925 1.985zm0 1.986L3.7 7.277v9.445l8.225 3.58 8.225-3.58V7.277L11.925 3.97z"/>
						</svg>
					{:else if link.iconId === 'v0'}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
							<path d="M5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13A2.5 2.5 0 0 1 5.5 3zM8 16l4-8 4 8"/>
						</svg>
					{/if}
					<span class="pa-item-label">{link.label}</span>
					<svg class="pa-external" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<line x1="7" y1="17" x2="17" y2="7"></line>
						<polyline points="7 7 17 7 17 17"></polyline>
					</svg>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Scoped styles — page-actions control only. No shared tokens polluted. */
	.page-actions {
		position: relative;
		display: inline-flex;
		align-items: center;
	}

	/* F3: visually hidden aria-live region */
	.pa-live {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* ── Primary button ─────────────────────────────────────────────────── */
	.pa-primary {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 14px 6px 12px;
		background: var(--surface-raised, #2a2a2a);
		color: var(--foreground, #fff);
		border: 1px solid var(--border, rgba(255,255,255,0.1));
		border-right: none;
		border-radius: 8px 0 0 8px;
		font-size: var(--text-sm, 13px);
		font-family: inherit;
		cursor: pointer;
		transition: background 150ms ease;
		white-space: nowrap;
		min-width: 10ch; /* prevent layout shift on label change */
	}

	.pa-primary:hover {
		background: var(--surface-hover, #333);
	}

	/* ── Chevron toggle ─────────────────────────────────────────────────── */
	.pa-chevron {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 100%;
		padding: 0;
		background: var(--surface-raised, #2a2a2a);
		color: var(--foreground, #fff);
		border: 1px solid var(--border, rgba(255,255,255,0.1));
		border-radius: 0 8px 8px 0;
		cursor: pointer;
		transition: background 150ms ease;
	}

	.pa-chevron:hover {
		background: var(--surface-hover, #333);
	}

	.pa-chevron svg {
		transition: transform 150ms ease;
	}

	.pa-chevron svg.rotated {
		transform: rotate(180deg);
	}

	/* ── Dropdown panel ─────────────────────────────────────────────────── */
	.pa-dropdown {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		z-index: 200;
		min-width: 260px;
		padding: 6px;
		background: var(--surface-raised, #1e1e1e);
		border: 1px solid var(--border, rgba(255,255,255,0.1));
		border-radius: 12px;
		box-shadow: 0 8px 32px rgba(0,0,0,0.4);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	/* ── Menu items ─────────────────────────────────────────────────────── */
	.pa-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 9px 10px;
		border-radius: 8px;
		background: transparent;
		border: none;
		color: var(--foreground, #fff);
		font-family: inherit;
		font-size: var(--text-sm, 13px);
		cursor: pointer;
		text-decoration: none;
		transition: background 120ms ease;
		width: 100%;
		text-align: left;
	}

	.pa-item:hover {
		background: var(--surface-hover, rgba(255,255,255,0.06));
	}

	.pa-item-text {
		display: flex;
		flex-direction: column;
		gap: 1px;
		flex: 1;
	}

	.pa-item-label {
		font-size: var(--text-sm, 13px);
		color: var(--foreground, #fff);
		line-height: 1.3;
	}

	.pa-item-sub {
		font-size: var(--text-xs, 11px);
		color: var(--text-muted, rgba(255,255,255,0.45));
		line-height: 1.2;
	}

	.pa-external {
		margin-left: auto;
		color: var(--text-muted, rgba(255,255,255,0.4));
		flex-shrink: 0;
	}

	/* ── AI section ─────────────────────────────────────────────────────── */
	.pa-section-label {
		padding: 10px 10px 4px;
		font-size: var(--text-xs, 11px);
		color: var(--text-muted, rgba(255,255,255,0.4));
		letter-spacing: 0.02em;
	}

	.pa-ai-item {
		color: var(--foreground, rgba(255,255,255,0.85));
	}
</style>
