import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;

function ExpensesList() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Create an axios instance with base configuration
  const axiosInstance = axios.create({
    baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com/api',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/expenses');
      const formattedData = response.data.map((expense) => ({
        ...expense,
        createdAt: formatDate(expense.createdAt)
      }));
      setExpenses(formattedData);
      setFilteredExpenses(formattedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setError(
        error.response?.data?.message || 
        error.message || 
        "An unexpected error occurred while fetching expenses."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/expenses/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray) return 'N/A';
    const [year, month, day, hours, minutes] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleFilter = (searchText, category) => {
    const filtered = expenses.filter((expense) => {
      const matchesDescription = expense.description
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesCategory =
        category === "" || expense.category.categoryName === category;
      return matchesDescription && matchesCategory;
    });
    setFilteredExpenses(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axiosInstance.delete(`/expenses/${id}`);
        // Refresh the expenses list after deletion
        fetchExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
        setError(
          error.response?.data?.message || 
          error.message || 
          "An unexpected error occurred while deleting the expense."
        );
      }
    }
  };

  const handleSort = (sortField, sortDirection) => {
    const sorted = [...filteredExpenses].sort((a, b) => {
      const aField = a[sortField];
      const bField = b[sortField];
      if (typeof aField === "string") {
        return sortDirection === "asc"
          ? aField.localeCompare(bField)
          : bField.localeCompare(aField);
      }
      return sortDirection === "asc" ? aField - bField : bField - aField;
    });
    setFilteredExpenses(sorted);
  };

  const handlePagination = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, Math.ceil(filteredExpenses.length / itemsPerPage))
        : Math.max(prev - 1, 1)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Expenses List</h2>

      {/* Error Handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Button Container */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/user/expensesForm/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
        >
          Add New Expense
        </Link>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600"
        >
          Back Home
        </Link>
      </div>

      {/* Search and Filter Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          id="searchInput"
          placeholder="Search by description"
          onChange={(e) =>
            handleFilter(e.target.value, document.getElementById("categoryFilter").value)
          }
          className="p-2 border border-gray-300 rounded-md shadow-sm"
        />
        <select
          id="categoryFilter"
          onChange={(e) =>
            handleFilter(document.getElementById("searchInput").value, e.target.value)
          }
          className="p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.categoryName}>
              {category.categoryName}
            </option>
          ))}
        </select>
        <select
          id="sortField"
          onChange={(e) => handleSort(e.target.value, document.getElementById("sortDirection").value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="description">Description</option>
          <option value="amount">Amount</option>
          <option value="createdAt">Date</option>
        </select>
        <select
          id="sortDirection"
          onChange={(e) => handleSort(document.getElementById("sortField").value, e.target.value)}
          className="p-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Expenses Table */}
      {isLoading ? (
        <div className="text-center py-4">Loading expenses...</div>
      ) : (
        <>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">File</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((expense) => (
                    <tr key={expense.id}>
                      <td className="border border-gray-300 px-4 py-2">{expense.description}</td>
                      <td className="border border-gray-300 px-4 py-2">{expense.amount}</td>
                      <td className="border border-gray-300 px-4 py-2">{expense.createdAt}</td>
                      <td className="border border-gray-300 px-4 py-2">{expense.category.categoryName}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {expense.fileUrl ? (
                          <a
                            href={`https://personalexpensetrackerbackend-3htl.onrender.com/${expense.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Download
                          </a>
                        ) : (
                          "No File"
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => navigate(`/user/expenses/edit/${expense.id}`)}
                          className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                    No expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePagination("prev")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mx-2"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">Page {currentPage}</span>
            <button
              onClick={() => handlePagination("next")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mx-2"
              disabled={currentPage * itemsPerPage >= filteredExpenses.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExpensesList;