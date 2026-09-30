/** Shared clipboard state for actions that render their own button or menu. */
/* Ported from arc-library/lib/use-copy-feedback.ts (React hook -> Svelte 5 runes factory). */
export function createCopyFeedback(duration = 1900) {
    let state = $state('idle');
    let activeKey = $state(null);
    let timeout = null;
    function clear() {
        if (timeout)
            clearTimeout(timeout);
        timeout = null;
    }
    function reset() {
        clear();
        state = 'idle';
        activeKey = null;
    }
    async function copy(value, key = 'default') {
        clear();
        activeKey = key;
        try {
            await navigator.clipboard.writeText(value);
            state = 'copied';
            timeout = setTimeout(reset, duration);
            return true;
        }
        catch {
            state = 'error';
            timeout = setTimeout(reset, duration);
            return false;
        }
    }
    return {
        get state() {
            return state;
        },
        get activeKey() {
            return activeKey;
        },
        copy,
        reset
    };
}
