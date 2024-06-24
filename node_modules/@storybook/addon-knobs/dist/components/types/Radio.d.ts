import React, { Component } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
export type RadiosTypeKnobValue = string | number | null | undefined;
export type RadiosTypeOptionsProp<T extends RadiosTypeKnobValue> = Record<string | number, T>;
export interface RadiosTypeKnob extends KnobControlConfig<RadiosTypeKnobValue> {
    options: RadiosTypeOptionsProp<RadiosTypeKnobValue>;
}
interface RadiosTypeProps extends KnobControlProps<RadiosTypeKnobValue>, RadiosWrapperProps {
    knob: RadiosTypeKnob;
}
interface RadiosWrapperProps {
    isInline: boolean;
}
declare class RadiosType extends Component<RadiosTypeProps> {
    static defaultProps: RadiosTypeProps;
    static propTypes: {
        knob: React.Validator<RadiosTypeKnob>;
        onChange: React.Validator<(value: RadiosTypeKnobValue) => RadiosTypeKnobValue>;
        isInline: React.Validator<boolean>;
    };
    static serialize: (value: RadiosTypeKnobValue) => RadiosTypeKnobValue;
    static deserialize: (value: RadiosTypeKnobValue) => RadiosTypeKnobValue;
    private renderRadioButtonList;
    private renderRadioButton;
    render(): React.JSX.Element;
}
export default RadiosType;
