import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

function UpdateExpenseForm() {
  const { id } = useParams(); // Get expense ID from route
  const navigate = useNavigate(); // Navigate programmatically
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create an axios instance with base configuration
  const axiosInstance = axios.create({
    baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expense details
        const expenseResponse = await axiosInstance.get(`/expenses/${id}`);
        setFormData({
          description: expenseResponse.data.description,
          amount: expenseResponse.data.amount,
          category: expenseResponse.data.category?.id || "",
        });

        // Fetch categories
        const categoriesResponse = await axiosInstance.get('/expenses/categories');
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load expense details or categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear any previous errors
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare expense data matching backend structure
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: {
          id: formData.category
        }
      };

      // Send PUT request to update expense
      await axiosInstance.put(`/expenses/${id}`, expenseData);
      
      // Navigate to expenses list on success
      navigate('/user/expenses');
    } catch (error) {
      console.error("Error updating expense:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Update Expense
        </h2>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
              disabled={isLoading}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Amount Field */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              required
              disabled={isLoading}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white font-medium rounded-md shadow-md 
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                } 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isLoading ? 'Updating...' : 'Update Expense'}
            </button>
            <button
              type="button"
              onClick={() => navigate("/user/expenses")}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gray-500 text-white font-medium rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateExpenseForm;