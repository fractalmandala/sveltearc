import { docs, type DocMeta } from './registry';

export interface SearchHit {
	slug: string;
	title: string;
	description: string;
	/** Group display title (falls back to the raw `DocMeta.group` value). */
	group: string;
	score: number;
}

interface Entry {
	slug: string;
	title: string;
	description: string;
	group: string;
	titleL: string;
	slugL: string;
	groupL: string;
	api: string[];
	blurb: string;
	ai: string;
}

// groups.ts lands in a parallel lane (Task 7, Lane A). A glob resolves to {} until it exists,
// so this file compiles either way and picks up group titles the moment it does.
const groupModules = import.meta.glob<{ GROUP_BY_ID: Record<string, { title: string }> }>('./groups.ts', {
	eager: true
});
const groupTitle = (id: string) => Object.values(groupModules)[0]?.GROUP_BY_ID?.[id]?.title ?? id;

// Built on the first search, never at module load (Task 7 R6).
let index: Entry[] | null = null;

function build(): Entry[] {
	return Object.entries(docs)
		.map(([slug, doc]: [string, DocMeta]) => {
			const group = groupTitle(doc.group);
			return {
				slug,
				title: doc.title,
				description: doc.description,
				group,
				titleL: doc.title.toLowerCase(),
				slugL: slug.replace(/-/g, ' '),
				groupL: group.toLowerCase(),
				api: doc.api.map((row) => row.name.toLowerCase()),
				blurb: `${doc.tagline ?? ''} ${doc.description}`.toLowerCase(),
				ai: (doc.notesForAi ?? []).join(' ').toLowerCase()
			};
		})
		.sort((a, b) => a.title.localeCompare(b.title));
}

export const tokens = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean);

function subsequence(needle: string, haystack: string) {
	let at = 0;
	for (const ch of haystack) if (ch === needle[at] && ++at === needle.length) return true;
	return false;
}

/** Best score for one token against one entry, or 0 for no match. */
function scoreToken(t: string, e: Entry): number {
	if (e.titleL === t) return 100;
	if (e.titleL.startsWith(t)) return 80;
	if (e.titleL.split(/[\s-]+/).some((word) => word.startsWith(t))) return 65;
	if (e.titleL.includes(t)) return 50;
	if (e.slugL.includes(t)) return 45;
	if (e.api.includes(t)) return 35;
	if (e.groupL.includes(t)) return 30;
	if (e.api.some((name) => name.includes(t))) return 25;
	if (t.length >= 2 && subsequence(t, e.titleL)) return 20;
	if (e.blurb.includes(t)) return 15;
	if (e.ai.includes(t)) return 10;
	return 0;
}

/**
 * Ranks docs against every whitespace-separated word of `query` (all words must match).
 * An empty query lists everything alphabetically so the palette can double as a browser.
 */
export function search(query: string, limit = 8): SearchHit[] {
	index ??= build();
	const words = tokens(query);
	const hits: SearchHit[] = [];
	for (const e of index) {
		let score = 0;
		for (const word of words) {
			const s = scoreToken(word, e);
			if (!s) {
				score = -1;
				break;
			}
			score += s;
		}
		if (score < 0) continue;
		hits.push({ slug: e.slug, title: e.title, description: e.description, group: e.group, score });
	}
	hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
	return hits.slice(0, limit);
}

export interface Segment {
	text: string;
	hit: boolean;
}

/** Splits `text` into runs, marking the parts that match a query word (for <mark> in results). */
export function highlight(text: string, query: string): Segment[] {
	const words = tokens(query);
	if (!words.length) return [{ text, hit: false }];
	const lower = text.toLowerCase();
	const marked = new Array<boolean>(text.length).fill(false);
	for (const word of words) {
		let from = 0;
		for (let at = lower.indexOf(word, from); at !== -1; at = lower.indexOf(word, from)) {
			marked.fill(true, at, at + word.length);
			from = at + word.length;
		}
	}
	const out: Segment[] = [];
	for (let i = 0; i < text.length; i++) {
		const last = out[out.length - 1];
		if (last && last.hit === marked[i]) last.text += text[i];
		else out.push({ text: text[i], hit: marked[i] });
	}
	return out;
}
