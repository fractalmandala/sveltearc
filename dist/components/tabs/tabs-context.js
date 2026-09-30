import { getContext, setContext } from 'svelte';
const TABS_KEY = Symbol('TABS_CONTEXT');
export function setTabsContext(ctx) {
    setContext(TABS_KEY, ctx);
}
export function getTabsContext() {
    return getContext(TABS_KEY);
}
