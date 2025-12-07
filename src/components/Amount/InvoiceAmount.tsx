
import {InvoiceAmountComponentProps, VatRoundingStrategy} from "./types";
import './amount.styles.css';
import {DefaultInput} from "./Form/DefaultInput";
import {useMemo, useState} from "react";

export const InvoiceAmount = ({
    editable = false,
    className,
    values,
    options,
    onChange
}: InvoiceAmountComponentProps) => {
    const {
        inputComponent: InputComponent = DefaultInput,
        vatRoundingStrategy = 'none' as VatRoundingStrategy,
        debounceTimeoutMs = 500,
        vatSettings = [0]
    } = options ?? {};

    const [vat, setVat] = useState<number>(values?.vat ?? 0);
    const [amount, setAmount] = useState<number>(values?.price?.netAmount ?? 0);

    const debouncedAmountChange = useMemo(() => {
        let timer: ReturnType<typeof setTimeout>;

        return (newAmount: string) => {
            clearTimeout(timer);

            let amountValue = 0;
            if (newAmount) {
                amountValue = parseFloat(newAmount);
            }

            timer = setTimeout(() => {
                setAmount(amountValue);
                onChange?.({
                    vat: vat,
                    price: {
                        netAmount: amountValue,
                        grossAmount: parseFloat(getAmount(amountValue, vat))
                    }
                });
            }, debounceTimeoutMs)
        }
    }, [onChange, amount, vat]);

    const handleRounding = (amount: number, roundingStrategy: VatRoundingStrategy): number => {
        switch (roundingStrategy) {
            case 'half-up':
                const floorAmount = Math.floor(amount);
                const diff = amount - floorAmount;

                return diff > 0.5 ? Math.ceil(amount) : floorAmount + 0.5;

            case 'half-even': {
                const floorAmount = Math.floor(amount);
                const diff = amount - floorAmount;

                return diff > 0.5 ? Math.ceil(amount) : Math.floor(amount);
            }

            case 'floor':
                return Math.floor(amount);

            case 'ceil':
                return Math.ceil(amount);

            default: {
                if (typeof roundingStrategy === 'function') {
                    return roundingStrategy(amount);
                }

                return amount;
            }
        }
    }
    const getAmount = (
        amount?: number,
        vat: number = 0,
    ): string => {
        if (vat < 0) {
            vat = 0;
        }

        amount = amount ?? 0;

        const calculated = amount + (amount * (vat / 100));

        if (vatRoundingStrategy === 'none' || vat === 0) {
            return calculated.toFixed(2);
        }

        return handleRounding(calculated, vatRoundingStrategy).toFixed(2);
    }

    const handleVatChange = (newVatValue: string) => {
        let vatValue = 0;
        if (newVatValue) {
            vatValue = parseInt(newVatValue, 10);
        }

        setVat(vatValue);
        onChange?.({
            vat: vatValue,
            price: {
                netAmount: amount,
                grossAmount: parseFloat(getAmount(amount, vatValue))
            }
        });
    }

    return (
        <div className={`invoice-amount ${className ?? ''}`}>
            <div className={'invoice-amount-cell invoice-vat'}>
                <InputComponent
                    id={'kh-vat'}
                    value={vat}
                    options={vatSettings}
                    type={'select'}
                    disabled={!editable}
                    label={'VAT'}
                    onChange={(v) => handleVatChange(v as string)}
                    onFocusOut={(e) => {
                        if (!e.target.value) {
                            e.target.value = String(vat);
                        }
                    }}
                />
            </div>
            <div className={'invoice-amount-cell invoice-net'}>
                <InputComponent
                    id={'kh-net'}
                    value={getAmount(amount)}
                    type={'string'}
                    disabled={!editable}
                    onFocusOut={(e) => {
                        if (!e.target.value) {
                            e.target.value = getAmount(amount); // making sure field always contains value
                            return;
                        }

                        e.target.value = getAmount(parseFloat(e.target.value)); // reformat value
                    }}
                    label={'Net'}
                    onChange={(v) => debouncedAmountChange(v as string)}
                />
            </div>
            <div className={'invoice-amount-cell invoice-gross'}>
                <InputComponent
                    id={'kh-gross'}
                    value={getAmount(amount, vat)}
                    type={'string'}
                    disabled={true}
                    label={'Brutto'}
                />
            </div>
        </div>
    );
};
