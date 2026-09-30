export const DRAWER_ROOT = Symbol('DRAWER_ROOT');

export interface DrawerRootContext {
	open: () => boolean;
}
