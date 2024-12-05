import PropTypes from 'prop-types';
// Button component
export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 font-semibold rounded-md focus:outline-none';

  // Define styles based on the variant prop
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700', // Optional for destructive actions
  };

  // Combine base styles with variant styles and any additional className passed
  const buttonClass = `${baseStyle} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,  // Validates that 'children' is provided and is a React node (string, element, etc.)
    variant: PropTypes.oneOf(['primary', 'secondary', 'destructive']), // Optional variant validation
    className: PropTypes.string, // Optional className validation
  };
