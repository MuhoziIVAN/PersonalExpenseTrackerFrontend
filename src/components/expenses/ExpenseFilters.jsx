import  { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export const ExpenseFilters = ({ onFilterChange }) => {
  const [error, setError] = useState('');

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError('Amount must be positive.');
    } else {
      setError('');
      onFilterChange('amount', value);
    }
  };

  return (
    <div className="mb-6 flex gap-4 flex-wrap">
      <Select
        defaultValue="all"
        className="w-40"
        onChange={(e) => onFilterChange('category', e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="food">Food</option>
        <option value="transport">Transport</option>
        <option value="utilities">Utilities</option>
      </Select>

      <Input
        type="text"
        placeholder="Description"
        className="w-40"
        onChange={(e) => onFilterChange('description', e.target.value)}
      />

      <div className="relative">
        <Input
          type="number"
          placeholder="Amount"
          className="w-40"
          onChange={handleAmountChange}
        />
        {error && <p className="text-red-500 text-sm absolute">{error}</p>}
      </div>

      <Input
        type="date"
        className="w-40"
        onChange={(e) => onFilterChange('date', e.target.value)}
      />

      <Select
        defaultValue="desc"
        className="w-40"
        onChange={(e) => onFilterChange('sort', e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>
    </div>
  );
};

ExpenseFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};
