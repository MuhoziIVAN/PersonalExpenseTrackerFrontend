// import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export const ExpenseTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Created At</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">File</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{expense.description}</td>
                <td className="p-4">${Number(expense.amount).toFixed(2)}</td>
                <td className="p-4">{format(new Date(expense.createdAt), 'MMM dd, yyyy')}</td>
                <td className="p-4">{expense.category}</td>
                <td className="p-4">
                  {expense.file ? (
                    <a href={expense.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View File
                    </a>
                  ) : (
                    'No File'
                  )}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => onEdit(expense)}
                      aria-label={`Edit expense: ${expense.description}`}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDelete(expense.id)}
                      aria-label={`Delete expense: ${expense.description}`}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

ExpenseTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      createdAt: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      file: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
