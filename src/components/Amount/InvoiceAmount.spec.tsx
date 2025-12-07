import {InvoiceAmountComponentProps} from "./types";
import {render, fireEvent, screen} from "@testing-library/react";
import {InvoiceAmount} from "./InvoiceAmount";


describe('InvoiceAmount', () => {
    const renderComponent = (props?: Partial<InvoiceAmountComponentProps>) => {
        const defaultProps: InvoiceAmountComponentProps = {
            editable: false,
            values: {
                vat: 10,
                price: {
                    netAmount: 100,
                },
            },
            onChange: jest.fn(),
            ...props,
        };
        return render(<InvoiceAmount {...defaultProps} />);
    };

    test("correctly calculates VAT with 0 if options were not present", () => {
        const mockOnChange = jest.fn();
        renderComponent({
            onChange: mockOnChange,
            editable: true,
        });

        const vatInput = screen.getByLabelText("VAT");
        fireEvent.change(vatInput, { target: { value: "20" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 0,
            price: {
                netAmount: 100,
                grossAmount: 100,
            },
        });
    });

    test("correctly calculates VAT", () => {
        const mockOnChange = jest.fn();
        renderComponent({
            onChange: mockOnChange,
            editable: true,
            options: {
                vatSettings: [0, 10, 19, 20, 23],
            },
        });

        const vatInput = screen.getByLabelText("VAT");
        fireEvent.change(vatInput, { target: { value: "20" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 20,
            price: {
                netAmount: 100,
                grossAmount: 120,
            },
        });

        fireEvent.change(vatInput, { target: { value: "23" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 23,
            price: {
                netAmount: 100,
                grossAmount: 123,
            },
        });
    });

    test("correctly calculates and rounds VAT half-up", () => {
        const mockOnChange = jest.fn();
        renderComponent({
            onChange: mockOnChange,
            editable: true,
            values: {
                vat: 0,
                price: {
                    netAmount: 9.99
                }
            },
            options: {
                vatSettings: [0, 19, 23],
                vatRoundingStrategy: 'half-up'
            },
        });

        const vatInput = screen.getByLabelText("VAT");
        fireEvent.change(vatInput, { target: { value: "19" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 19,
            price: {
                netAmount: 9.99,
                grossAmount: 12,
            },
        });

        fireEvent.change(vatInput, { target: { value: "23" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 23,
            price: {
                netAmount: 9.99,
                grossAmount: 12.50,
            },
        });
    });

    test("correctly calculates and rounds VAT half-even", () => {
        const mockOnChange = jest.fn();
        renderComponent({
            onChange: mockOnChange,
            editable: true,
            values: {
                vat: 0,
                price: {
                    netAmount: 49.99
                }
            },
            options: {
                vatSettings: [0, 10, 19, 23],
                vatRoundingStrategy: 'half-even'
            },
        });

        const vatInput = screen.getByLabelText("VAT");
        fireEvent.change(vatInput, { target: { value: "10" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 10,
            price: {
                netAmount: 49.99,
                grossAmount: 55,
            },
        });

        fireEvent.change(vatInput, { target: { value: "19" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 19,
            price: {
                netAmount: 49.99,
                grossAmount: 59,
            },
        });

        fireEvent.change(vatInput, { target: { value: "23" } });

        expect(mockOnChange).toHaveBeenCalledWith({
            vat: 23,
            price: {
                netAmount: 49.99,
                grossAmount: 61,
            },
        });
    });
})