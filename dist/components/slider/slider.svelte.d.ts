import type { Props, SliderValue } from './slider.types';
declare function $$render<T extends SliderValue = number>(): {
    props: Props<T>;
    exports: {};
    bindings: "value" | "ref";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends SliderValue = number> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "value" | "ref";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends SliderValue = number>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends SliderValue = number>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const Slider: $$IsomorphicComponent;
type Slider<T extends SliderValue = number> = InstanceType<typeof Slider<T>>;
export default Slider;
