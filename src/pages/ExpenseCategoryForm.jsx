import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for handling cookies/sessions
});

function ExpenseCategoryForm({ 
  categoryData = {}, 
  onSubmit, 
  onCancel 
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: categoryData.id || null,
    categoryName: categoryData.categoryName || "",
    description: categoryData.description || "",
  });

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
      let response;
      if (formData.id) {
        // Update existing category
        response = await axiosInstance.put(`/expenses-categories/${formData.id}`, formData);
      } else {
        // Create new category
        response = await axiosInstance.post('/expenses-categories', formData);
      }

      // Call onSubmit if provided
      if (onSubmit) {
        onSubmit(response.data);
      }

      // Navigate back to categories list
      navigate('/user/categories');
    } catch (error) {
      console.error("Error submitting category:", error);
      
      // Set user-friendly error message
      setError(
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    // Default navigation if no onCancel prop is provided
    navigate('/user/categories');
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        {formData.id ? "Edit Category" : "Add New Category"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Hidden ID Field */}
        {formData.id && <input type="hidden" name="id" value={formData.id} />}

        {/* Category Name */}
        <div className="form-group">
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category Name:
          </label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            required
            placeholder="Enter category name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description:
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit Button */}
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
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {/* Cancel Button */}
        <div className="cancel-container mt-4 text-center">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 inline-block bg-gray-500 text-white font-medium rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Updated PropTypes
ExpenseCategoryForm.propTypes = {
  categoryData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    categoryName: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

// Default props
ExpenseCategoryForm.defaultProps = {
  categoryData: {},
  onSubmit: () => {},
  onCancel: () => {},
};

export default ExpenseCategoryForm;