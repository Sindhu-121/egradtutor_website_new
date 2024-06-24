import React, { Component } from 'react';
import { KnobControlConfig, KnobControlProps } from './types';
type TextTypeKnobValue = string;
export type TextTypeKnob = KnobControlConfig<TextTypeKnobValue> & {
    value?: TextTypeKnobValue;
};
type TextTypeProps = KnobControlProps<TextTypeKnobValue>;
export default class TextType extends Component<TextTypeProps> {
    static defaultProps: TextTypeProps;
    static propTypes: {
        knob: React.Validator<KnobControlConfig<string>>;
        onChange: React.Validator<(value: string) => string>;
    };
    static serialize: (value: TextTypeKnobValue) => string;
    static deserialize: (value: TextTypeKnobValue) => string;
    shouldComponentUpdate(nextProps: TextTypeProps): boolean;
    private handleChange;
    render(): React.JSX.Element;
}
export {};
