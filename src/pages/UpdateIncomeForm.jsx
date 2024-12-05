import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function UpdateIncomeForm() {
  const { id } = useParams(); // Get the income ID from the route
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch income and categories when component mounts
  useEffect(() => {
    fetchIncome();
    fetchCategories();
  }, []);

  const fetchIncome = async () => {
    try {
      const response = await axiosInstance.get(`/income/${id}`);
      const data = response.data;
      
      setFormData({
        source: data.source,
        amount: data.amount,
        category: JSON.stringify(data.category), // Match the format in IncomeForm
      });
    } catch (error) {
      console.error("Error fetching income data:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An error occurred while fetching income details."
      );
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/income/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An error occurred while fetching categories."
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ 
      ...prevData, 
      [name]: value 
    }));
    // Clear any previous errors when user starts typing
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      // Parse the category to extract just the ID
      const categoryData = JSON.parse(formData.category);
      
      // Prepare submit data with the correct category structure
      const submitData = {
        source: formData.source,
        amount: parseFloat(formData.amount),
        category: {
          id: categoryData.id,
          categoryId: categoryData.categoryId,
          categoryName: categoryData.categoryName,
          description: categoryData.description,
          createdAt: categoryData.createdAt
        }
      };
  
      // Send PUT request to update income
      await axiosInstance.put(`/income/${id}`, submitData);
      
      // Navigate back to income list on successful submission
      navigate('/user/income');
    } catch (error) {
      console.error("Error updating income:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-lg w-full p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Income
        </h2>

        {/* Error Handling */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Source Input */}
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
              placeholder="Enter source of income"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="Enter amount"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={JSON.stringify(category)}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className={`w-full px-6 py-2 text-white font-medium rounded-md shadow-md 
                ${isSubmitting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                } 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Income'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/user/income')}
              className="w-full px-6 py-2 bg-gray-500 text-white font-medium rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateIncomeForm;