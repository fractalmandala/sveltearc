declare const DrawerClose: import("svelte").Component<Omit<{}, "child" | "children"> & {
    child?: import("svelte").Snippet<[{
        props: Record<string, unknown>;
    }]> | undefined;
    children?: import("svelte").Snippet<[]> | undefined;
    style?: import("bits-ui").StyleProperties | string | null | undefined;
    ref?: HTMLElement | null | undefined;
} & import("bits-ui").Without<import("bits-ui").BitsPrimitiveButtonAttributes, import("bits-ui").AlertDialogTriggerPropsWithoutHTML>, {}, "ref">;
type DrawerClose = ReturnType<typeof DrawerClose>;
export default DrawerClose;
