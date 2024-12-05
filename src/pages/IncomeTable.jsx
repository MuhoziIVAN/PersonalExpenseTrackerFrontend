import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function IncomeTable({ 
  expenses, 
  currentPage, 
  itemsPerPage, 
  onDeleteIncome 
}) {
  const navigate = useNavigate();
  const start = (currentPage - 1) * itemsPerPage;
  const currentExpenses = expenses.slice(start, start + itemsPerPage);

  const handleEdit = (id) => {
    navigate(`/user/updateIncome/${id}`);
  };

  const handleDelete = (id) => {
    // Show confirmation dialog before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete this income entry?");
    if (confirmDelete) {
      onDeleteIncome(id);
    }
  };

  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">Source</th>
          <th className="border border-gray-300 px-4 py-2">Amount</th>
          <th className="border border-gray-300 px-4 py-2">Created At</th>
          <th className="border border-gray-300 px-4 py-2">Category</th>
          <th className="border border-gray-300 px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {currentExpenses.map((expense) => (
          <tr key={expense.id}>
            <td className="border border-gray-300 px-4 py-2">{expense.source}</td>
            <td className="border border-gray-300 px-4 py-2">
              ${expense.amount.toFixed(2)}
            </td>
            <td className="border border-gray-300 px-4 py-2">{expense.createdAt}</td>
            <td className="border border-gray-300 px-4 py-2">
              {expense.category.categoryName}
            </td>
            <td className="border border-gray-300 px-4 py-2">
              <button
                onClick={() => handleEdit(expense.id)}
                className="text-blue-500 mr-2 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(expense.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

IncomeTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      source: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired,
      category: PropTypes.shape({
        categoryName: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onDeleteIncome: PropTypes.func.isRequired,
};

export default IncomeTable;