import React from "react";

export interface VatRoundingCallback {
    (grossAmount: number): number;
}

export type VatRoundingStrategy = 'half-up' | 'half-even' | 'floor' | 'ceil' | 'none' | VatRoundingCallback;

type InvoiceAmountComponentOptions = {
    vatSettings: number[];
    inputComponent?: React.ComponentType<InvoiceAmountInputProps>;
    vatRoundingStrategy?: VatRoundingStrategy;
    debounceTimeoutMs?: number;
}

type OnValueChange = (value: InvoiceAmountValueProps) => void;

export type InvoiceAmountComponentProps = {
    editable?: boolean,
    values?: InvoiceAmountValueProps,
    options?: InvoiceAmountComponentOptions,
    className?: string,
    onChange?: OnValueChange
};

export interface InvoiceAmountInputProps {
    value: unknown;
    type: 'number' | 'string' | 'select';
    options?: string[] | number[];
    disabled: boolean;
    onChange?: (value: number | string) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocusOut?: (event: React.FocusEvent<HTMLInputElement>) => void;
    id?: string;
    label?: string;
}

export type InvoiceAmountValueProps = {
    vat: number,
    price: {
        netAmount: number,
        grossAmount?: number
    }
}