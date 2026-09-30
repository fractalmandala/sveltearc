export type CopyFeedbackState = 'idle' | 'copied' | 'error';
/** Shared clipboard state for actions that render their own button or menu. */
export declare function createCopyFeedback(duration?: number): {
    readonly state: CopyFeedbackState;
    readonly activeKey: string | null;
    copy: (value: string, key?: string) => Promise<boolean>;
    reset: () => void;
};
