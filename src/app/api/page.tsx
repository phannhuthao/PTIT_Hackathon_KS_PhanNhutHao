"use client";
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Product = {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
    category_id: number;
};

type NewProduct = {
    name: string;
    image: string;
    price: number;
    quantity: number;
};

type Category = {
    category_id: number;
    name: string;
};

type NewCategory = {
    name: string;
};

export default function Page() {
    // State for Products
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<NewProduct>({
        name: '',
        image: '',
        price: 0,
        quantity: 0
    });
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        // Fetch products based on the search term
        axios.get<Product[]>("http://localhost:3000/api/product", {
            params: {
                search: searchTerm
            }
        })
        .then(res => setProducts(res.data))
        .catch(error => console.error("Error fetching products:", error));
    }, [searchTerm]);

    useEffect(() => {
        // Fetch categories
        axios.get<Category[]>("http://localhost:3000/api/category")
            .then(res => setCategories(res.data))
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    // Handle Product Changes
    const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
        const { name, value } = e.target;
        if (isEdit && editProduct) {
            setEditProduct(prev => prev ? { ...prev, [name]: value } : null);
        } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle Product Submit
    const handleProductSubmit = (e: React.FormEvent, isEdit: boolean = false) => {
        e.preventDefault();
        if (isEdit && editProduct) {
            axios.patch<Product>("http://localhost:3000/api/product", editProduct)
                .then(res => {
                    setProducts(prev => prev.map(product => product.id === res.data.id ? res.data : product));
                    setEditProduct(null);
                })
                .catch(error => console.error("Error updating product:", error));
        } else {
            axios.post<Product>("http://localhost:3000/api/product", newProduct)
                .then(res => {
                    setProducts(prev => [...prev, res.data]);
                    setNewProduct({ name: '', image: '', price: 0, quantity: 0 });
                })
                .catch(error => console.error("Error adding product:", error));
        }
    };

    // Handle Product Delete
    const handleProductDelete = (id: number) => {
        axios.delete("http://localhost:3000/api/product", { data: { id } })
            .then(() => setProducts(prev => prev.filter(product => product.id !== id)))
            .catch(error => console.error("Error deleting product:", error));
    };


    return (
        <>
            <div>
                <input
                    type='search'
                    placeholder='Tìm kiếm sản phẩm theo tên...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>
            
            <div className="flex flex-wrap relative">
                <div className="w-4/5 pr-4">
                    {products.length > 0 && (
                        <table className="min-w-full border-collapse border border-gray-300 rounded-lg" style={{ borderRadius: '6px' }}>
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">STT</th>
                                    <th className="border border-gray-300 px-4 py-2">Tên</th>
                                    <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>
                                    <th className="border border-gray-300 px-4 py-2">Giá</th>
                                    <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                                    <th className="border border-gray-300 px-4 py-2">Danh Mục</th>
                                    <th className="border border-gray-300 px-4 py-2">Chức năng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover" />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{product.price}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">{product.category_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                className="bg-gray-500 text-white py-1 px-2 rounded mr-2"
                                                onClick={() => setEditProduct(product)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-1 px-2 rounded"
                                                onClick={() => handleProductDelete(product.id)}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="w-1/5">
                    <form onSubmit={(e) => handleProductSubmit(e)} className="border border-black rounded-lg p-4">
                        <h1 className="text-xl font-bold mb-4">Thêm mới sản phẩm</h1>
                        <div className="mb-2">
                            <label className="block mb-1">Tên</label>
                            <input
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={(e) => handleProductChange(e)}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Hình ảnh</label>
                            <input
                                type="text"
                                name="image"
                                value={newProduct.image}
                                onChange={(e) => handleProductChange(e)}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Giá</label>
                            <input
                                type="number"
                                name="price"
                                value={newProduct.price}
                                onChange={(e) => handleProductChange(e)}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block mb-1">Số lượng</label>
                            <input
                                type="number"
                                name="quantity"
                                value={newProduct.quantity}
                                onChange={(e) => handleProductChange(e)}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Thêm sản phẩm</button>
                    </form>
                </div>

                {editProduct && (
                    <>
                        <div className="fixed inset-0 bg-gray-700 bg-opacity-50" onClick={() => setEditProduct(null)}></div>
                        <div className="fixed inset-0 flex justify-center items-center">
                            <form
                                onSubmit={(e) => handleProductSubmit(e, true)}
                                className="border border-black rounded-lg p-4 bg-white z-10"
                            >
                                <h1 className="text-xl font-bold mb-4">Chỉnh sửa sản phẩm</h1>
                                <div className="mb-2">
                                    <label className="block mb-1">Tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editProduct.name}
                                        onChange={(e) => handleProductChange(e, true)}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Hình ảnh</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={editProduct.image}
                                        onChange={(e) => handleProductChange(e, true)}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Giá</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editProduct.price}
                                        onChange={(e) => handleProductChange(e, true)}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1">Số lượng</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editProduct.quantity}
                                        onChange={(e) => handleProductChange(e, true)}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Cập nhật sản phẩm</button>
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white py-2 px-4 rounded w-full mt-2"
                                    onClick={() => setEditProduct(null)}
                                >
                                    Hủy
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
