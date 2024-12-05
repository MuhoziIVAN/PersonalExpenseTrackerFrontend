// import React from 'react';
import PropTypes from 'prop-types';

// Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={`border rounded-lg shadow-lg bg-white ${className}`}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,  // Ensures that children is a valid React node
  className: PropTypes.string,          // Ensures that className is a string (optional)
};

// CardHeader Component
export const CardHeader = ({ children, className }) => {
  return (
    <div className={`p-4 border-b ${className}`}>
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,  // Ensures that children is a valid React node
  className: PropTypes.string,          // Ensures that className is a string (optional)
};

// CardContent Component
export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,  // Ensures that children is a valid React node
  className: PropTypes.string,          // Ensures that className is a string (optional)
};
