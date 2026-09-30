export interface TabsContextValue {
    value: () => string;
    setValue: (val: string) => void;
}
export declare function setTabsContext(ctx: TabsContextValue): void;
export declare function getTabsContext(): TabsContextValue | undefined;
