
type InvoiceProductResponse = {
    products: {
        id: number,
        title: string,
        price: number
    }[]
}

type ApiError = {
    code: number,
    message: string
}

type ApiResponse<T> = T | ApiError

export interface InvoiceProduct {
    id: number,
    name: string,
    price: number
}

export const getInvoiceProducts = async (): Promise<InvoiceProduct[]> => {
    const response = await fetch('https://dummyjson.com/products');

    if (!response.ok) {
        throw new Error('Error fetching products: ' + response.statusText);
    }

    const data: InvoiceProductResponse = await response.json();

    return data.products.map(product => ({
        id: product.id,
        name: product.title,
        price: product.price
    }))
}