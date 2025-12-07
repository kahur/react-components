import {InvoiceAmountInputProps} from "../types";
import {useEffect, useState} from "react";

export const DefaultInput = ({
    type,
    value,
    options,
    onChange,
    disabled = false,
    ...props
} : InvoiceAmountInputProps) => {
    const [currentValue, setCurrentValue] = useState<string | number>(type === 'number' ? value as number : value as string);

    useEffect(() => {
        setCurrentValue(type === 'number' ? value as number : value as string);
    }, [value]);

    const handleValueChange = (changedValue: string | number): void => {
        setCurrentValue(changedValue);
        onChange?.(changedValue);
    };

    const renderLabel = (label: string, id?: string) => {
        return <label htmlFor={id}>{label}</label>
    }

    if (type === 'select') {
        if (!Array.isArray(options)) {
            throw new Error('Select input must have an array of options');
        }

        return (
            <div className={'input-group'}>
                {props?.label && renderLabel(props.label, props?.id)}
                <select
                    id={props.id}
                    disabled={disabled}
                    onChange={(v) => handleValueChange(v.target.value)}
                    value={currentValue}
                >
                    {options.map((option, index) => <option key={index} value={option}>{option}</option>)}
                </select>
            </div>
        );
    }

    if (!['string', 'number'].includes(typeof value)) {
        throw new Error('Input value must be a string or a number');
    }

    return (
        <div className={'input-group'}>
            {props?.label && renderLabel(props.label, props?.id)}
            <input
                className={'input'}
                id={props.id}
                disabled={disabled}
                type={type}
                onChange={(v) => handleValueChange(v.target.value)}
                value={currentValue}
                onFocus={props?.onFocus}
                onBlur={props?.onFocusOut}
            />
        </div>
    )
}