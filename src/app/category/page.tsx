"use client";
import React, { useState, useEffect } from 'react';

type Category = {
  category_id: number;
  title: string;
};

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryTitle, setNewCategoryTitle] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);
  const [editCategoryTitle, setEditCategoryTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/category')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Failed to fetch categories:', error));
  }, []);

  const handleAddCategory = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('http://localhost:3000/api/category', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newCategoryTitle }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.category_id) {
          setCategories([...categories, data]);
          setNewCategoryTitle('');
        }
      })
      .catch((error) => console.error('Failed to add category:', error));
  };

  const handleDeleteCategory = (category_id: number) => {
    fetch('http://localhost:3000/api/category', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id }),
    })
      .then(() => setCategories(categories.filter((category) => category.category_id !== category_id)))
      .catch((error) => console.error('Failed to delete category:', error));
  };

  const handleEditCategory = (category_id: number) => {
    setEditCategoryId(category_id);
    const categoryToEdit = categories.find(category => category.category_id === category_id);
    if (categoryToEdit) {
      setEditCategoryTitle(categoryToEdit.title);
    }
  };

  const handleUpdateCategory = (event: React.FormEvent) => {
    event.preventDefault();
    if (editCategoryId === null) return;

    fetch('http://localhost:3000/api/category', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: editCategoryId, title: editCategoryTitle }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.category_id) {
          setCategories(categories.map((category) => category.category_id === editCategoryId ? data : category));
          setEditCategoryId(null);
          setEditCategoryTitle('');
        }
      })
      .catch((error) => console.error('Failed to update category:', error));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Quản lí danh mục</h1>

      {editCategoryId !== null ? (
        <form onSubmit={handleUpdateCategory} className="w-full max-w-md mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={editCategoryTitle}
              onChange={(e) => setEditCategoryTitle(e.target.value)}
              placeholder="Nhập tên danh mục"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Cập nhật
            </button>
            <button
              type="button"
              onClick={() => setEditCategoryId(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleAddCategory} className="w-full max-w-md mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newCategoryTitle}
              onChange={(e) => setNewCategoryTitle(e.target.value)}
              placeholder="Nhập tên danh mục"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Thêm
            </button>
          </div>
        </form>
      )}

      <div className="w-full max-w-4xl overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border-b">STT</th>
              <th className="px-4 py-2 border-b">Tên</th>
              <th className="px-4 py-2 border-b" colSpan={2}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.category_id}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{category.title}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleDeleteCategory(category.category_id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Xóa
                  </button>
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEditCategory(category.category_id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
