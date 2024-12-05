// import React from 'react';
import PropTypes from 'prop-types';

// Select component
export const Select = ({ children, className, ...props }) => {
  return (
    <select
      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};

// PropTypes validation
Select.propTypes = {
  children: PropTypes.node.isRequired,  // Child options to populate the select
  className: PropTypes.string,          // Optional additional CSS class names
};
