import { getContext, setContext } from 'svelte';

export interface TabsContextValue {
	value: () => string;
	setValue: (val: string) => void;
}

const TABS_KEY = Symbol('TABS_CONTEXT');

export function setTabsContext(ctx: TabsContextValue) {
	setContext(TABS_KEY, ctx);
}

export function getTabsContext(): TabsContextValue | undefined {
	return getContext<TabsContextValue>(TABS_KEY);
}
