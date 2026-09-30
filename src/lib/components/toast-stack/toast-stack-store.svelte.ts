import { getContext, hasContext, setContext } from 'svelte';
import type {
	ToastOptions,
	ToastRecord,
	ToastStackApi,
	ToastTarget,
	ToastType
} from './toast-stack.types';

/** Each tucked toast shows this many pixels above the one in front of it. */
export const PEEK = 14;
/** Space between toasts when the stack is open. */
export const GAP = 12;
/** Tucked toasts shrink by this much per step back. */
export const STEP = 0.05;
/** The card's top and bottom borders, added to the measured content height. */
export const BORDER = 2;

const durationFor = (type: ToastType, base: number): number =>
	type === 'loading' ? Infinity : type === 'warning' || type === 'error' ? base * 1.6 : base;

/**
 * Closed, tucked toasts take the front toast's height so their edges line up;
 * open, each takes its own and they stack with a gap. Ported verbatim from ARC —
 * Phase 1 applies the resulting targets as static inline styles (no springs).
 */
export function layoutStack(
	toasts: ToastRecord[],
	heights: Record<string, number>,
	expanded: boolean,
	visibleToasts: number
): { targets: ToastTarget[]; listHeight: number } {
	const front = toasts.length ? (heights[toasts[0].id] ?? 0) : 0;
	const tops = toasts.reduce<number[]>(
		(sum, item, index) => [
			...sum,
			sum[index] + (index < visibleToasts ? (heights[item.id] ?? 0) + GAP : 0)
		],
		[0]
	);
	const targets = toasts.map((item, index): ToastTarget => {
		const visible = index < visibleToasts;
		const depth = Math.min(index, visibleToasts);
		return expanded
			? {
					y: -tops[index],
					scale: 1,
					height: heights[item.id] ?? 0,
					opacity: visible ? 1 : 0,
					content: 1
				}
			: {
					y: -PEEK * depth,
					scale: 1 - STEP * depth,
					height: index === 0 ? (heights[item.id] ?? 0) : front,
					opacity: visible ? 1 : 0,
					content: index === 0 ? 1 : 0
				};
	});
	const listHeight = !toasts.length
		? 0
		: expanded
			? tops[toasts.length] - GAP
			: front + PEEK * (Math.min(toasts.length, visibleToasts) - 1);
	return { targets, listHeight };
}

/**
 * Reactive toast queue — the Svelte counterpart of ARC's `createToastStore`.
 * `toasts` is `$state`, so readers re-render with no subscribe/getSnapshot
 * bookkeeping. One instance lives per `ToastStackProvider`.
 */
export class ToastStackStore implements ToastStackApi {
	toasts = $state<ToastRecord[]>([]);
	seq = 0;

	constructor(
		public base: number = 5000,
		public limit: number = 12
	) {}

	toast = (options: ToastOptions): string => {
		if (options.id && this.toasts.some((item) => item.id === options.id)) {
			this.update(options.id, options);
			return options.id;
		}
		const type = options.type ?? 'info';
		this.seq += 1;
		const { id: _ignored, ...rest } = options;
		const record: ToastRecord = {
			...rest,
			id: options.id ?? `toast-${this.seq}`,
			type,
			duration: options.duration ?? durationFor(type, this.base),
			seq: this.seq,
			version: 0
		};
		this.toasts = [record, ...this.toasts].slice(0, this.limit);
		return record.id;
	};

	update = (id: string, patch: Partial<Omit<ToastOptions, 'id'>>): void => {
		const found = this.toasts.find((item) => item.id === id);
		if (!found) return;
		const type = patch.type ?? found.type;
		const record: ToastRecord = {
			...found,
			...patch,
			type,
			duration: patch.duration ?? durationFor(type, this.base),
			version: found.version + 1
		};
		this.toasts = this.toasts.map((item) => (item.id === id ? record : item));
	};

	dismiss = (id?: string): void => {
		if (id === undefined) {
			if (this.toasts.length) this.toasts = [];
			return;
		}
		if (this.toasts.some((item) => item.id === id)) {
			this.toasts = this.toasts.filter((item) => item.id !== id);
		}
	};

	runAction = (id: string): void => {
		const found = this.toasts.find((item) => item.id === id);
		if (!found?.action) return;
		found.action.onClick(id);
		if (this.toasts.find((item) => item.id === id)?.version === found.version) {
			this.dismiss(id);
		}
	};

	get count(): number {
		return this.toasts.length;
	}

	getSnapshot = (): ToastRecord[] => this.toasts;
}

const KEY = Symbol('toast-stack');

export function provideToastStack(store: ToastStackStore): void {
	setContext(KEY, store);
}

export function useToastStackStore(): ToastStackStore | null {
	return hasContext(KEY) ? getContext<ToastStackStore>(KEY) : null;
}

/**
 * Shows, updates, and dismisses toasts from anywhere inside the provider.
 * `count` is how many toasts are queued. Throws outside a provider, like ARC.
 */
export function useToastStack(): ToastStackApi & { count: number } {
	const store = useToastStackStore();
	if (!store) throw new Error('Render toast stack consumers inside <ToastStackProvider>.');
	return {
		toast: store.toast,
		update: store.update,
		dismiss: store.dismiss,
		get count() {
			return store.count;
		}
	};
}
