import { useState, useEffect } from "react";
import axios from "axios";
import IncomeTable from "./IncomeTable";
import IncomeFilters from "./IncomeFilters";

axios.defaults.withCredentials = true;

// Create an axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;

  // Fetch income categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/income/categories');
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories");
    }
  };

  // Fetch income list
  const fetchIncomes = async () => {
    try {
      const response = await axiosInstance.get('/income');
      const formattedData = response.data.map((income) => ({
        ...income,
        createdAt: formatDate(income.createdAt)
      }));
      setIncomes(formattedData);
      setFilteredIncomes(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      setError("Failed to fetch income list");
      setIsLoading(false);
    }
  };

  // Combined fetch for both categories and incomes
  useEffect(() => {
    fetchCategories();
    fetchIncomes();
  }, []);

  // Delete income entry
  const handleDeleteIncome = async (id) => {
    try {
      await axiosInstance.delete(`/income/${id}`);
      // Remove the deleted income from the list
      const updatedIncomes = incomes.filter(income => income.id !== id);
      setIncomes(updatedIncomes);
      setFilteredIncomes(updatedIncomes);
    } catch (error) {
      console.error("Error deleting income:", error);
      setError("Failed to delete income entry");
    }
  };

  // Date formatting utility
  const formatDate = (dateArray) => {
    if (!dateArray) return 'N/A';
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Filtering logic
  const handleFilter = (searchText, category) => {
    const filtered = incomes.filter((income) => {
      const matchesSource = income.source.toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        category === "" || income.category.categoryName === category;
      return matchesSource && matchesCategory;
    });
    setFilteredIncomes(filtered);
    setCurrentPage(1);
  };

  // Sorting logic
  const handleSort = (sortField, sortDirection) => {
    const sorted = [...filteredIncomes].sort((a, b) => {
      const aField = a[sortField];
      const bField = b[sortField];

      if (typeof aField === "string") {
        return sortDirection === "asc"
          ? aField.localeCompare(bField)
          : bField.localeCompare(aField);
      }
      return sortDirection === "asc" ? aField - bField : bField - aField;
    });
    setFilteredIncomes(sorted);
  };

  // Pagination handlers
  const handlePagination = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, Math.ceil(filteredIncomes.length / itemsPerPage))
        : Math.max(prev - 1, 1)
    );
  };

  // Render loading or error states
  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Income List</h1>
        <div className="flex space-x-4">
          <a
            href="/user/incomeForm"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Income
          </a>
          <a
            href="/dashboard"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Back Home
          </a>
        </div>
      </header>
  
      <IncomeFilters 
        onFilter={handleFilter} 
        onSort={handleSort} 
        categories={categories} 
      />
  
      <IncomeTable
        expenses={filteredIncomes}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onDeleteIncome={handleDeleteIncome}
      />
  
      <footer className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => handlePagination("prev")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage}</span>
        <button
          onClick={() => handlePagination("next")}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          disabled={currentPage * itemsPerPage >= filteredIncomes.length}
        >
          Next
        </button>
      </footer>
    </div>
  );
  
}

export default IncomeList;