import { FunctionComponent } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
type BooleanTypeKnobValue = boolean;
export type BooleanTypeKnob = KnobControlConfig<BooleanTypeKnobValue>;
export interface BooleanTypeProps extends KnobControlProps<BooleanTypeKnobValue> {
    knob: BooleanTypeKnob;
}
declare const serialize: (value: BooleanTypeKnobValue) => string | null;
declare const deserialize: (value: string | null) => boolean;
declare const BooleanType: FunctionComponent<BooleanTypeProps> & {
    serialize: typeof serialize;
    deserialize: typeof deserialize;
};
export default BooleanType;
