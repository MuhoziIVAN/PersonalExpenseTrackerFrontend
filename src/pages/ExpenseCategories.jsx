import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

function ExpenseCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/expenses-categories');
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred while fetching categories."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axiosInstance.delete(`/expenses-categories/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
        alert(
          error.response?.data?.message || 
          error.message || 
          "An error occurred while deleting the category."
        );
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Expense Categories</h1>

      {/* Button Container */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/user/category/"
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          Add New Category
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
        >
          Back Home
        </Link>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading categories...</div>
      ) : (
        // Categories Table
        <table className="table-auto w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-800 font-medium">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Category Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{category.id}</td>
                  <td className="px-4 py-2 border">{category.categoryName}</td>
                  <td className="px-4 py-2 border">{category.description}</td>
                  <td className="px-4 py-2 border">
                    <Link
                      to={`/user/expenses-categories/${category.id}/edit`}
                      className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ExpenseCategories;