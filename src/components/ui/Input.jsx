// import React from 'react';
import PropTypes from 'prop-types';

// Input component
export const Input = ({ type, placeholder, className, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

// PropTypes validation
Input.propTypes = {
  type: PropTypes.string.isRequired,  // Input type (text, number, date, etc.)
  placeholder: PropTypes.string,      // Placeholder text
  className: PropTypes.string,        // Optional additional CSS class names
};
