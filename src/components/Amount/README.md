# InvoiceAmount Component

The `InvoiceAmount` component is a reusable React component designed for handling invoice calculations including VAT, net amount, and gross amount. It provides configurability for rounding strategies, input debouncing, and editable fields, allowing flexible integration into billing and invoicing systems.

---

## Features

- Supports VAT, net amount, and gross amount calculations.
- Pluggable input components for customization.
- Debounced input updates for better performance during editing.
- Handles VAT rounding via multiple configurable rounding strategies.
- Provides default and configurable VAT options.

---

## Rounding Strategies

The `vatRoundingStrategy` determines how the gross amount is rounded for accuracy. Below are the available strategies:

- **`"none"`**: No rounding is applied; preserves the raw calculated value.
- **`"half-up"`**: Rounds up to closest .5 or up ( `119.195 -> 119.50`, `119.51 -> 120.00` )
- **`"half-even"`**: Rounds to the nearest even number for tie-breaking decimal values. ( `119.195 -> 119.20`, `119.145 -> 119.14` )
- **`"floor"`**: Always rounds down to the nearest integer. ( `119.195 -> 119.00` )
- **`"ceil"`**: Always rounds up to the nearest integer. ( `119.195 -> 120.00` )


- **Custom Function**: Pass a custom function for your own rounding logic (e.g., `(value) => Math.round(value * 10) / 10`). Function must respect following interface:
```ts
export interface VatRoundingCallback {
    (grossAmount: number): number;
}
```

## Example usage

```tsx
import { InvoiceAmount } from 'kh-react-components'
const App = () => {    
    return (
        <InvoiceAmount
            editable={true} // true / false if you want to enable / disable edit mode
            values={{ vat: 20, price: { netAmount: 100 } }} // (optional) initial values respecting interface InvoiceAmountValueProps
            onChange={(value) => console.log(value)} // onChange callback to handle changes value comming as InvoiceAmountValueProps
        />
    )
}
```

## Customization 
```tsx
import { InvoiceAmount } from 'kh-react-components'
import { CustomInputComponent } from './my-components';

const App = () => {    
    return (
        <InvoiceAmount
            editable={true} // true / false if you want to enable / disable edit mode
            className="custom-invoice-amount" // custom class name 
            values={{ vat: 20, price: { netAmount: 100 } }} // (optional) initial values respecting interface InvoiceAmountValueProps
            options={{
                vatRoundingStrategy: "none", // 'half-up' | 'half-even' | 'floor' | 'ceil' | 'none' | VatRoundingCallback
                vatSettings: [0], // passing VAT values to be offered
                debounceTimeoutMs: 500, // debounce time for Net value changes to give user more time for changes before formatting & changes are applied
                inputComponent: CustomInputComponent // component must support props from interface InvoiceAmountInputProps, example of how to implement it can be found in DefaultInput.tsx
            }} // (optional) configuration options, default values are applied as in example
            onChange={handleInvoiceChange} // onChange callback to handle changes value comming as InvoiceAmountValueProps
        />
    )
}
```