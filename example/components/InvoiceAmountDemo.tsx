import React, {useEffect, useState} from 'react';
import './demo.styles.css';
import {getInvoiceProducts} from "../api/invoice.api";
import {MaterialUiInput} from "./form/MaterialUiInput";
import {InvoiceAmount, InvoiceAmountValueProps, VatRoundingStrategy} from "@kh-react-components/Amount";

/**
 * This component and example was written just to demostrate usage. Thus it's not very clean and it's not optimized.
 */
export const InvoiceAmountDemo = () => {

    const vat = [0, 10, 19, 20, 23]; // VAT rates in percent could be some config for example
    const [editable, setEditable] = useState(false);
    const [customInput, setCustomInput] = useState<boolean>(false);

    const [items, setItems] = useState<{
        name: string,
        amount: InvoiceAmountValueProps
    }[] | null>(null);
    const [loading, setLoading] = useState(false);
    // strategy used as it's most common strategy for invoices in czech republic roudning to closest half
    const [roundingStrategy, setRoundingStrategy] = useState<VatRoundingStrategy>('half-even');

    const getVat = (): number => {
        return vat[Math.floor(Math.random() * vat.length)];
    }

    useEffect(() => {
        const productsLoading = async() => {
            setLoading(true);
            const response = await getInvoiceProducts();
            setItems(
                response.map(product => ({
                    name: product.name,
                    amount: {
                        vat: getVat(),
                        price: {
                            netAmount: product.price
                        }
                    }
                }))
            );

            setLoading(false);
        }

        productsLoading().catch(e => console.error(e));
    }, []);

    return (
        <div className="demo-container">
            <h2>InvoiceAmount Component Demo</h2>
            {loading ? <div>Loading ...</div> : (
                <>
                    <div className={'action-buttons'}>
                        <button onClick={() => setEditable(!editable)}>
                            Toggle Edit Mode ({editable ? 'Editable' : 'Read-Only'})
                        </button>
                        <button onClick={() => setCustomInput(!customInput)}>
                            Input ({customInput ? 'Default' : 'MaterialUI'})
                        </button>
                        <label>Rounding strategy: </label>
                        <select
                            onChange={(v) => setRoundingStrategy(v.target.value as VatRoundingStrategy)}
                            value={typeof roundingStrategy == 'string' ? roundingStrategy : 'half-up'}
                        >
                            <option value={'none'}>none</option>
                            <option value={'half-up'}>half-up</option>
                            <option value={'half-even'}>half-even</option>
                            <option value={'floor'}>floor</option>
                            <option value={'ceil'}>ceil</option>
                        </select>
                    </div>
                    <div className={'invoice-container'}>
                        <h2>Some invoice headers & Customer info</h2>
                        <div className={'items'}>
                            {items && items.map(item =>
                                <div className={'invoice-row'}>
                                    <div>
                                        {item.name}
                                    </div>
                                    <div>
                                        <InvoiceAmount
                                            editable={editable}
                                            values={item.amount}
                                            options={{
                                                vatSettings: vat,
                                                vatRoundingStrategy: roundingStrategy,
                                                ...(customInput && { inputComponent: MaterialUiInput })
                                            }}
                                            onChange={(values) => console.log(values)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};