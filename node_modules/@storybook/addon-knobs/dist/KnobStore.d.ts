import { Knob } from './type-defs';
type Callback = () => any;
export type KnobStoreKnob = Knob & {
    name: string;
    label: string;
    used?: boolean;
    defaultValue?: any;
    hideLabel?: boolean;
    callback?: () => any;
};
export default class KnobStore {
    store: Record<string, KnobStoreKnob>;
    callbacks: Callback[];
    timer: number | undefined;
    has(key: string): boolean;
    set(key: string, value: KnobStoreKnob): void;
    update(key: string, options: Partial<KnobStoreKnob>): void;
    get(key: string): KnobStoreKnob;
    getAll(): Record<string, KnobStoreKnob>;
    reset(): void;
    markAllUnused(): void;
    subscribe(cb: Callback): void;
    unsubscribe(cb: Callback): void;
}
export {};
