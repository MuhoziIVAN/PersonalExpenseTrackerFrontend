import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('/reset-password', 
        {
          token: token,
          newPassword: newPassword
        },
        {
          baseURL: 'https://personalexpensetrackerbackend-3htl.onrender.com',
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: function (status) {
            return status >= 200 && status < 300;
          }
        }
      );
  
      // Explicitly use response data
      const responseMessage = response.data;
      setSuccessMessage(responseMessage || "Password reset successful");
      setErrorMessage('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            setErrorMessage(error.response.data || 'Failed to reset password');
          } else if (error.request) {
            // The request was made but no response was received
            setErrorMessage('No response received from server');
          } else {
            // Something happened in setting up the request
            setErrorMessage('Error processing your request');
          }
          setSuccessMessage('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <input 
            type="hidden" 
            name="token" 
            value={token} 
          />

          <div className="mb-4">
            <label 
              htmlFor="newPassword" 
              className="block text-gray-700 font-bold mb-2"
            >
              New Password
            </label>
            <input 
              type="password" 
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label 
              htmlFor="confirmPassword" 
              className="block text-gray-700 font-bold mb-2"
            >
              Confirm New Password
            </label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>

          {errorMessage && (
            <p className="mt-4 text-center text-red-600 bg-red-100 p-2 rounded-md">
              {errorMessage}
            </p>
          )}

          {successMessage && (
            <p className="mt-4 text-center text-green-600 bg-green-100 p-2 rounded-md">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;