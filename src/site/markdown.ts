/**
 * markdown.ts — Lane C · Page Actions & Markdown I/O
 *
 * Single serializer for all three consumers:
 *   1. "Copy page as Markdown" clipboard action
 *   2. GET /components/[name]/markdown endpoint
 *   3. /llms.txt index (one-line summary per doc)
 *
 * FROZEN interface (§2.4):
 *   export function docToMarkdown(doc: DocMeta, slug: string): string
 */

import type { DocMeta } from './registry';

// ─── AI tool URL builders ─────────────────────────────────────────────────────

/** Short AI prompt — just references the markdown URL instead of embedding the full doc (F4). */
export function aiPrompt(doc: DocMeta, markdownUrl: string): string {
	return `Read ${markdownUrl} and help me use the ${doc.title} component from the Arc UI library for SvelteKit.`;
}

/**
 * Return all four AI tool entries with label, icon-id, and href.
 * markdownUrl must be an absolute URL (built client-side from location.origin + markdownUrl prop).
 */
export function aiLinks(
	doc: DocMeta,
	markdownUrl: string
): { label: string; iconId: string; href: string }[] {
	const prompt = aiPrompt(doc, markdownUrl);
	const q = encodeURIComponent(prompt);
	return [
		{ label: 'Open in ChatGPT', iconId: 'chatgpt', href: `https://chatgpt.com/?q=${q}` },
		{ label: 'Open in Claude', iconId: 'claude', href: `https://claude.ai/new?q=${q}` },
		{ label: 'Open in Cursor', iconId: 'cursor', href: `cursor://anysphere.cursor-deeplink/prompt?text=${q}` },
		{ label: 'Open in v0', iconId: 'v0', href: `https://v0.dev/chat?q=${q}` },
	];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fence(code: string, lang = ''): string {
	return `\`\`\`${lang}\n${code.trim()}\n\`\`\``;
}

function rows(items: string[], prefix = '-'): string {
	return items.map((i) => `${prefix} ${i}`).join('\n');
}

/** Escape GFM table pipe characters inside a cell value (F1). */
function cell(value: string): string {
	return value.replace(/\|/g, '\\|');
}

/** Derive a package manager label from the CLI install line (F6). */
function pkgLabel(cli: string): string {
	if (cli.startsWith('yarn')) return 'yarn';
	if (cli.startsWith('npx') || cli.startsWith('bunx')) return cli.split(' ')[0];
	return 'pnpm';
}

// ─── Serializer ───────────────────────────────────────────────────────────────

/**
 * Deterministic DocMeta → Markdown.
 * Output is stable: same DocMeta always produces the same bytes.
 * Consumers must NOT add their own formatting on top.
 */
export function docToMarkdown(doc: DocMeta, slug: string): string {
	const parts: string[] = [];

	// Header
	parts.push(`# ${doc.title}`);
	// F6: skip tagline block when tagline equals description (avoids duplicate sentence)
	if (doc.tagline && doc.tagline !== doc.description) parts.push(`> ${doc.tagline}`);
	parts.push(doc.description);

	// When to use / avoid
	if (doc.whenToUse?.length) {
		parts.push(`## When to use\n\n${rows(doc.whenToUse)}`);
	}
	if (doc.whenNotToUse?.length) {
		parts.push(`## When not to use\n\n${rows(doc.whenNotToUse)}`);
	}

	// Install
	const installCli =
		typeof doc.install === 'string'
			? doc.install
			: (doc.install.cli ?? `pnpm dlx shadcn-svelte@latest add @arcui/${slug}`);
	parts.push(`## Installation\n\n${fence(installCli, 'bash')}`);

	if (typeof doc.install !== 'string' && doc.install.manual) {
		const { dependencies, steps } = doc.install.manual;
		if (dependencies.length) {
			parts.push(`### Manual — dependencies\n\n${rows(dependencies)}`);
		}
		if (steps.length) {
			parts.push(`### Manual — steps\n\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`);
		}
	}

	// Usage
	if (doc.usage) {
		parts.push(`## Usage\n\n${fence(doc.usage, 'svelte')}`);
	}

	// Variants
	if (doc.variants?.length) {
		const variantBlocks = doc.variants
			.map((v) => {
				const desc = v.description ? `\n\n${v.description}` : '';
				return `### ${v.name}${desc}\n\n${fence(v.code, 'svelte')}`;
			})
			.join('\n\n');
		parts.push(`## Variants\n\n${variantBlocks}`);
	}

	// API — escape | in every cell (F1)
	if (doc.api?.length) {
		const header = '| Prop | Type | Default | Description |';
		const sep = '| --- | --- | --- | --- |';
		const apiRows = doc.api
			.map((r) =>
				`| \`${cell(r.name)}\` | \`${cell(r.type)}\` | ${cell(r.default ?? '—')} | ${cell(r.description)} |`
			)
			.join('\n');
		parts.push(`## Props\n\n${header}\n${sep}\n${apiRows}`);
	}

	// Keyboard — escape | in action column (F1)
	if (doc.keyboard?.length) {
		const header = '| Key | Action |';
		const sep = '| --- | --- |';
		const kbRows = doc.keyboard.map((r) => `| \`${cell(r.key)}\` | ${cell(r.action)} |`).join('\n');
		parts.push(`## Keyboard\n\n${header}\n${sep}\n${kbRows}`);
	}

	// Accessibility
	if (doc.accessibility?.length) {
		parts.push(`## Accessibility\n\n${rows(doc.accessibility)}`);
	}

	// Motion
	if (doc.motion) {
		parts.push(`## Motion\n\n${doc.motion}`);
	}

	// Notes / AI notes
	if (doc.notes) {
		parts.push(`## Notes\n\n${doc.notes}`);
	}
	if (doc.notesForAi?.length) {
		parts.push(`## Notes for AI\n\n${rows(doc.notesForAi)}`);
	}

	// Related
	if (doc.related?.length) {
		const relLines = doc.related
			.map((r) => (r.slug ? `- [${r.name}](/components/${r.slug}) — ${r.description}` : `- **${r.name}** — ${r.description}`))
			.join('\n');
		parts.push(`## Related\n\n${relLines}`);
	}

	// Source provenance
	parts.push(`---\n\n_Source: \`${doc.source}\`_`);

	return parts.join('\n\n');
}

// Re-export pkgLabel for PageActions to derive the install subtitle.
export { pkgLabel };
