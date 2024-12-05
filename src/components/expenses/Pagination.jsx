// import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';

export const Pagination = ({ currentPage, onPageChange, hasMore }) => {
  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="secondary"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Previous
      </Button>
      <span className="text-sm">Page {currentPage}</span>
      <Button
        variant="secondary"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasMore}
        aria-label="Go to next page"
      >
        Next
      </Button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
};
