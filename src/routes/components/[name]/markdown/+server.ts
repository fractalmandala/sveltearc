/**
 * GET /components/[name]/markdown
 *
 * Returns the component's documentation as plain Markdown text.
 * Content-Type: text/markdown; charset=utf-8
 *
 * 200 — known component
 * 404 — unknown slug
 *
 * Lane C deliverable (§2.6).
 * Uses the shared docToMarkdown serializer — never a second implementation.
 */

import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDoc } from '$site/registry';
import { docToMarkdown } from '$site/markdown';

export const GET: RequestHandler = ({ params }) => {
	const { name } = params;
	const doc = getDoc(name);

	if (!doc) {
		error(404, `No component doc found for "${name}".`);
	}

	const body = docToMarkdown(doc, name);

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/markdown; charset=utf-8',
			// Allow LLM tools and CDNs to cache freely — docs are build-time stable.
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
		},
	});
};
