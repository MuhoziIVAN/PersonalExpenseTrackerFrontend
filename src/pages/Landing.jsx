// import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-end h-12 items-center space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-gray-200 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white hover:text-gray-200 text-sm font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-3rem)] px-4">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Your Financial Hub
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Effortlessly track your expenses, plan budgets, and achieve your financial goals.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium rounded-full transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;