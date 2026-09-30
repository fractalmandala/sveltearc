import type { Component } from 'svelte';
import { GROUP_BY_ID, UI_GROUPS } from './groups';

export interface ApiRow {
	name: string;
	type: string;
	default?: string;
	description: string;
}

export interface KeyboardRow {
	key: string;
	action: string;
}

export interface RelatedItem {
	name: string;
	slug?: string;
	description: string;
}

export interface VariantExample {
	name: string;
	description?: string;
	code: string;
}

export interface ManualInstall {
	dependencies: string[];
	steps: string[];
}

export interface DocMeta {
	title: string;
	tagline?: string;
	description: string;
	group: string;
	status: 'ported' | 'in-progress' | 'planned';
	whenToUse?: string[];
	whenNotToUse?: string[];
	/** One-line install command or dual CLI/manual spec. */
	install: string | { cli?: string; manual?: ManualInstall };
	/** Main usage example (Svelte source). */
	usage: string;
	/** Raw code snippet running the live demo, displayed in the Code tab. */
	demoCode?: string;
	variants?: VariantExample[];
	api: ApiRow[];
	keyboard?: KeyboardRow[];
	accessibility?: string[];
	motion: string;
	notes: string;
	notesForAi?: string[];
	related?: RelatedItem[];
	/** Path to the React source of truth, for provenance. */
	source: string;
}

// Site-only content. Lives in $site so nothing here ships in the component package.
const docModules = import.meta.glob<{ default: DocMeta }>('./docs/*.ts', { eager: true });
// Demos load lazily: one broken demo must not take down the index or other pages.
const demoModules = import.meta.glob<{ default: Component }>('./demos/*.svelte');

const slugOf = (path: string) => path.split('/').pop()!.replace(/\.(ts|svelte)$/, '');

export const docs: Record<string, DocMeta> = Object.fromEntries(
	Object.entries(docModules).map(([path, mod]) => [slugOf(path), mod.default])
);

export const demoLoaders: Record<string, () => Promise<{ default: Component }>> = Object.fromEntries(
	Object.entries(demoModules).map(([path, loader]) => [slugOf(path), loader])
);

export const slugs: string[] = Object.keys(docs).sort();

export function getDoc(slug: string): DocMeta | null {
	return docs[slug] ?? null;
}

export function getDemoLoader(slug: string): (() => Promise<{ default: Component }>) | null {
	return demoLoaders[slug] ?? null;
}

export interface NavGroupItem {
	slug: string;
	title: string;
	status: DocMeta['status'];
}

export interface NavGroup {
	id: string;
	title: string;
	order: number;
	items: NavGroupItem[];
}

/** Canonical group id for a doc slug; "ungrouped" when the slug or its group id is unknown. */
export function groupOf(slug: string): string {
	const id = docs[slug]?.group;
	return id && GROUP_BY_ID[id] ? id : 'ungrouped';
}

/** Nav groups ordered by UI_GROUPS; empty groups never render. */
export function navGroups(): NavGroup[] {
	const buckets = new Map<string, NavGroupItem[]>();
	for (const slug of slugs) {
		const id = groupOf(slug);
		if (!buckets.has(id)) buckets.set(id, []);
		buckets.get(id)!.push({ slug, title: docs[slug].title, status: docs[slug].status });
	}
	const groups: NavGroup[] = UI_GROUPS.filter((g) => buckets.has(g.id)).map((g) => ({
		id: g.id,
		title: g.title,
		order: g.order,
		items: buckets.get(g.id)!
	}));
	// Safety net: a doc whose group is not a valid id must not vanish from the nav.
	const ungrouped = buckets.get('ungrouped');
	if (ungrouped?.length) {
		groups.push({ id: 'ungrouped', title: 'Ungrouped', order: 999, items: ungrouped });
	}
	return groups;
}
