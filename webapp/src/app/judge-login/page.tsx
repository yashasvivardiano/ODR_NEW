'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function JudgeLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    judgeId: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Judge credentials (in a real app, this would be server-side authentication)
    const judgeCredentials = {
      'judge.eleanor@justicehub.com': { password: 'judge123', judgeId: 'JUDGE001', name: 'Judge Eleanor Vance' },
      'judge.michael@justicehub.com': { password: 'judge456', judgeId: 'JUDGE002', name: 'Judge Michael Chen' },
      'judge.sarah@justicehub.com': { password: 'judge789', judgeId: 'JUDGE003', name: 'Judge Sarah Williams' }
    };

    const judge = judgeCredentials[formData.email as keyof typeof judgeCredentials];
    
    if (judge && judge.password === formData.password && judge.judgeId === formData.judgeId) {
      // Set judge as logged in with role
      const judgeData = {
        email: formData.email,
        name: judge.name,
        judgeId: judge.judgeId,
        role: 'judge'
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(judgeData));
      localStorage.setItem('userRole', 'judge');
      
      console.log('Judge login successful:', judgeData);
      alert('Login successful! Redirecting to Judge Dashboard...');
      window.location.href = '/judge-dashboard';
    } else {
      alert('Invalid credentials. Please check your email, password, and Judge ID.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">⚖️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">JusticeHub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Regular Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚖️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Judge Login
            </h2>
            <p className="text-gray-600">
              Access your judicial dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="judge.eleanor@justicehub.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Judge ID
              </label>
              <input
                type="text"
                name="judgeId"
                value={formData.judgeId}
                onChange={handleInputChange}
                placeholder="JUDGE001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div className="text-left">
              <Link href="/forgot-password" className="text-orange-500 hover:text-orange-600 text-sm">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Login as Judge
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p>Email: judge.eleanor@justicehub.com</p>
              <p>Password: judge123</p>
              <p>Judge ID: JUDGE001</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Not a judge?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600">
                Regular Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
