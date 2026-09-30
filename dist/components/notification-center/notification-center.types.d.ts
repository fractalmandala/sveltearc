export interface NotificationItem {
    id: string;
    title: string;
    description?: string;
    time: string;
    read?: boolean;
    tone?: 'info' | 'success' | 'warning';
    /** A local portrait asset for person-generated updates. */
    actor?: {
        name: string;
        photo: string;
    };
}
/**
 * Port of ARC `NotificationCenter` — `registry/components/notification-center/notification-center.tsx`.
 *
 * Note: ARC ships this as a `block` and imports its own `Avatar`; the port
 * depends on `$lib/components/avatar/avatar.svelte`.
 */
export interface Props {
    notifications: NotificationItem[];
    label?: string;
    onReadChange?: (notification: NotificationItem, read: boolean) => void;
    onDismiss?: (notification: NotificationItem) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    avoidCollisions?: boolean;
}
