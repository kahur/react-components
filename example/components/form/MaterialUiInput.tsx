
import React, {useEffect, useState} from "react";
import {InvoiceAmountInputProps} from "../../../src/components/Invoice/InvoiceRow/Amount/types";
import {MenuItem, Select, TextField} from "@mui/material";

export const MaterialUiInput: React.FC<InvoiceAmountInputProps> = ({
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

    if (type === 'select') {
        if (!Array.isArray(options)) {
            throw new Error('Select input must have an array of options');
        }

        return (
            <div className={'input-group'}>
                <Select
                    variant={'filled'}
                    labelId={props.id}
                    label={props.label}
                    value={currentValue}
                    onChange={(e) => handleValueChange(e.target.value)}
                    disabled={disabled}
                >
                    {options.map((option, index) => <MenuItem key={index} value={option}>{option}%</MenuItem>)}
                </Select>
            </div>
        );
    }

    if (!['string', 'number'].includes(typeof value)) {
        throw new Error('Input value must be a string or a number');
    }

    return (
        <div className={'input-group'}>
            <TextField
                label={props.label}
                onChange={(e) => handleValueChange(e.target.value)}
                onFocus={props?.onFocus}
                onBlur={props?.onFocusOut}
                value={currentValue}
                disabled={disabled}
            />
        </div>
    )
}