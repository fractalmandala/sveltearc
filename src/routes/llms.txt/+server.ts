/**
 * GET /llms.txt
 *
 * Machine-readable index of all Arc UI component docs.
 * Format modelled on uiarc.dev/llms.txt.
 *
 * Content-Type: text/plain; charset=utf-8
 *
 * Lane C deliverable (§2.6).
 */

import type { RequestHandler } from './$types';
import { docs } from '$site/registry';
import { GROUP_BY_ID } from '$site/groups';

export const GET: RequestHandler = ({ url }) => {
	// F5: use request origin — works on every deploy and locally.
	const origin = url.origin;

	const lines: string[] = [
		'# Arc UI — Svelte component library',
		'# Machine-readable index of all component documentation pages.',
		'# Format: ## Title / description / Page / Markdown / Group / Status',
		'',
	];

	// Stable order: alphabetical by slug.
	const slugs = Object.keys(docs).sort();

	for (const slug of slugs) {
		const doc = docs[slug];
		const pageUrl = `${origin}/components/${slug}`;
		const mdUrl = `${origin}/components/${slug}/markdown`;
		const groupTitle = GROUP_BY_ID[doc.group]?.title ?? doc.group;

		lines.push(`## ${doc.title}`);
		lines.push(doc.description);
		lines.push('');
		lines.push(`- Page: ${pageUrl}`);
		lines.push(`- Markdown: ${mdUrl}`);
		lines.push(`- Group: ${groupTitle}`);
		lines.push(`- Status: ${doc.status}`);
		if (doc.tagline && doc.tagline !== doc.description) lines.push(`- Tagline: ${doc.tagline}`);
		lines.push('');
	}

	return new Response(lines.join('\n'), {
		status: 200,
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
		},
	});
};

