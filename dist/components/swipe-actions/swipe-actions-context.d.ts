export declare const SWIPE_GROUP: unique symbol;
export interface SwipeGroupContext {
    openId: () => string | null;
    setOpenId: (id: string | null) => void;
}
