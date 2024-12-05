import { useState } from "react";
import PropTypes from "prop-types";

function IncomeFilters({ onFilter, onSort }) {
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [sortField, setSortField] = useState("source");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleFilterChange = () => {
    onFilter(searchText, category);
  };

  const handleSortChange = () => {
    onSort(sortField, sortDirection);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by description"
          className="flex-1 border border-gray-300 rounded-md px-4 py-2"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyUp={handleFilterChange}
        />
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            handleFilterChange();
          }}
        >
          <option value="">All Categories</option>
          <option value="Salary">Salary</option>
          <option value="Investment">Investment</option>
        </select>
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={sortField}
          onChange={(e) => {
            setSortField(e.target.value);
            handleSortChange();
          }}
        >
          <option value="source">Source</option>
          <option value="amount">Amount</option>
          <option value="createdAt">Date</option>
        </select>
        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={sortDirection}
          onChange={(e) => {
            setSortDirection(e.target.value);
            handleSortChange();
          }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}

IncomeFilters.propTypes = {
    onFilter: PropTypes.func.isRequired,
    onSort: PropTypes.func.isRequired,
  };
  

export default IncomeFilters;
