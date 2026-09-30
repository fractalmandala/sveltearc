export const SWIPE_GROUP = Symbol('SWIPE_GROUP');

export interface SwipeGroupContext {
	openId: () => string | null;
	setOpenId: (id: string | null) => void;
}
