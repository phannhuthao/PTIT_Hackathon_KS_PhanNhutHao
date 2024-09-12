import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.resolve('category.json');

export async function GET() {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        const categories = JSON.parse(data);
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const categories = JSON.parse(fileData);

        const newCategory = {
            ...data,
            category_id: categories.length ? categories[categories.length - 1].category_id + 1 : 1
        };

        categories.push(newCategory);
        await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2));

        return NextResponse.json(newCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add category' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { category_id } = await request.json();
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const categories = JSON.parse(fileData);

        const updatedCategories = categories.filter((category: { category_id: number }) => category.category_id !== category_id);

        await fs.writeFile(dataFilePath, JSON.stringify(updatedCategories, null, 2));

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const data = await request.json();
        const { category_id, ...updates } = data;
        const fileData = await fs.readFile(dataFilePath, 'utf-8');
        const categories = JSON.parse(fileData);

        const categoryIndex = categories.findIndex((category: { category_id: number }) => category.category_id === category_id);

        if (categoryIndex === -1) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        categories[categoryIndex] = { ...categories[categoryIndex], ...updates };

        await fs.writeFile(dataFilePath, JSON.stringify(categories, null, 2));

        return NextResponse.json(categories[categoryIndex]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
