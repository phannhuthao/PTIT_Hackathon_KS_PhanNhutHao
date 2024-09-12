import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve('data.json');
const categoryFilePath = path.resolve('categories.json'); // Assuming you have a categories.json for categories

// Define types
interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category_id: number;
}

interface ProductUpdate {
    id: number;
    name?: string;
    image?: string;
    price?: number;
    quantity?: number;
    category_id?: number;
}

export async function GET() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const products: Product[] = JSON.parse(data);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data: Omit<Product, 'id'> = await request.json();
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileData);

        // Ensure unique id
        const maxId = products.length ? Math.max(...products.map((p: Product) => p.id)) : 0;
        const newProduct: Product = {
            ...data,
            id: maxId + 1
        };

        products.push(newProduct);
        await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));

        return NextResponse.json(newProduct);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id }: { id: number } = await request.json();
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileData);

        const updatedProducts = products.filter((product: Product) => product.id !== id);

        await fs.writeFile(dataFilePath, JSON.stringify(updatedProducts, null, 2));

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const data: ProductUpdate = await request.json();
        const { id, ...updates } = data;
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const products: Product[] = JSON.parse(fileData);

        const productIndex = products.findIndex((product: Product) => product.id === id);

        if (productIndex === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        products[productIndex] = { ...products[productIndex], ...updates };

        await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));

        return NextResponse.json(products[productIndex]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
