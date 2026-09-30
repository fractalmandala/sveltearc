/**
 * Section 1 guides — authored as markdown in the repo's `docs/` folder.
 *
 * The markdown files are the source of truth (frontmatter: title, description).
 * This module globs them at build time and exposes a frozen, ordered registry.
 * The Lead owns this file; guide content is owned by the authoring agent.
 */
export interface Guide {
	slug: string;
	title: string;
	description: string;
	order: number;
	/** Markdown body with the frontmatter stripped. */
	body: string;
	/** Original file path, for provenance. */
	source: string;
}

/** Canonical order. A guide not listed sorts last (alphabetical). */
const ORDER: Record<string, number> = {
	introduction: 1,
	installation: 2,
	theming: 3,
	motion: 4,
	'ai-and-mcp': 5,
	changelog: 6
};

const modules = import.meta.glob('../../docs/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return { data: {}, body: raw };
	const data: Record<string, string> = {};
	for (const line of match[1].split(/\r?\n/)) {
		const entry = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
		if (entry) data[entry[1]] = entry[2].replace(/^["']|["']$/g, '').trim();
	}
	return { data, body: raw.slice(match[0].length) };
}

const titleCase = (slug: string) =>
	slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');

export const GUIDES: Guide[] = Object.entries(modules)
	.map(([path, raw]) => {
		const slug = path.split('/').pop()!.replace(/\.md$/, '');
		const { data, body } = parseFrontmatter(raw);
		return {
			slug,
			title: data.title ?? titleCase(slug),
			description: data.description ?? '',
			order: ORDER[slug] ?? 999,
			body,
			source: path.replace(/^.*?\/docs\//, 'docs/')
		};
	})
	.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));

export const GUIDE_BY_SLUG: Record<string, Guide> = Object.fromEntries(
	GUIDES.map((guide) => [guide.slug, guide])
);

export function getGuide(slug: string): Guide | null {
	return GUIDE_BY_SLUG[slug] ?? null;
}
