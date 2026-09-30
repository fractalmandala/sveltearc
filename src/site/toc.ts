export interface TocItem {
	id: string;
	text: string;
	level: number;
}

const HEADING = /^H([1-6])$/;

function levelOf(node: Element): number {
	const tag = HEADING.exec(node.tagName);
	if (tag) return Number(tag[1]);
	const marked = Number(node.getAttribute('aria-level'));
	if (Number.isFinite(marked) && marked >= 1 && marked <= 6) return marked;
	return 2;
}

/** Headings in document order. Nodes without an id or visible text are skipped. */
export function collectSections(root: ParentNode, selector = '[data-toc]'): TocItem[] {
	const items: TocItem[] = [];
	const seen = new Set<string>();
	for (const node of root.querySelectorAll(selector)) {
		if (node.nodeType !== 1) continue;
		const el = node as Element;
		const id = el.id.trim();
		const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim();
		if (!id || !text || seen.has(id)) continue;
		seen.add(id);
		items.push({ id, text, level: levelOf(el) });
	}
	return items;
}

/**
 * The section whose heading has most recently crossed `offset` px from the
 * viewport top. Falls back to the first item while the reader is still above it.
 * Returns null when there is nothing to spy, including during SSR.
 */
export function activeSection(items: TocItem[], offset = 96): string | null {
	if (items.length === 0) return null;
	if (typeof document === 'undefined' || typeof window === 'undefined') return null;

	const scrollY = window.scrollY || document.documentElement?.scrollTop || 0;
	const line = scrollY + offset;
	let current: string | null = null;

	for (const item of items) {
		const el = document.getElementById(item.id);
		if (!el) continue;
		const top = el.getBoundingClientRect().top + scrollY;
		if (top <= line) current = item.id;
		else break;
	}

	return current ?? items[0].id;
}
