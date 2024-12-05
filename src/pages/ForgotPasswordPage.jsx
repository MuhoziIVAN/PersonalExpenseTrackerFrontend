import  { useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/forgot-password', 
        { email: email },  // Changed from URLSearchParams to JSON
        {
          baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com',
          headers: {
            'Content-Type': 'application/json',  // Changed from form-urlencoded
          },
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          }
        }
      );
  
      setSuccessMessage(response.data);  // Use response.data for message
      setErrorMessage('');
    } catch (error) {
      // Error handling remains the same
      if (error.response) {
        setErrorMessage(error.response.data || 'Failed to send password reset email');
      } else if (error.request) {
        setErrorMessage('No response received from server');
      } else {
        setErrorMessage('Error processing your request');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Forgot Password
        </h2>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-gray-700 font-bold mb-2"
            >
              Email
            </label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;