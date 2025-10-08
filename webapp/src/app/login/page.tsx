'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('Judge');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Judge'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      role: role
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Role-specific credentials and redirects
    const roleCredentials = {
      'Judge': {
        'judge.eleanor@justicehub.com': { password: 'judge123', name: 'Judge Eleanor Vance', id: 'JUDGE001' },
        'judge.michael@justicehub.com': { password: 'judge456', name: 'Judge Michael Chen', id: 'JUDGE002' }
      },
      'Lawyer': {
        'lawyer.sarah@justicehub.com': { password: 'lawyer123', name: 'Sarah Johnson', id: 'LAW001' },
        'lawyer.david@justicehub.com': { password: 'lawyer456', name: 'David Martinez', id: 'LAW002' }
      },
      'Witness': {
        'witness.john@justicehub.com': { password: 'witness123', name: 'John Smith', id: 'WIT001' },
        'witness.mary@justicehub.com': { password: 'witness456', name: 'Mary Wilson', id: 'WIT002' }
      },
      'Party': {
        'party.techcorp@justicehub.com': { password: 'party123', name: 'TechCorp Inc.', id: 'PARTY001' },
        'party.innovate@justicehub.com': { password: 'party456', name: 'Innovate Solutions', id: 'PARTY002' }
      }
    };

    const roleData = roleCredentials[selectedRole as keyof typeof roleCredentials];
    const user = roleData?.[formData.email as keyof typeof roleData];
    
    if (user && user.password === formData.password) {
      // Set user as logged in with role
      const userData = {
        email: formData.email,
        name: user.name,
        id: user.id,
        role: selectedRole
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', selectedRole);
      
      console.log('Login successful:', userData);
      alert(`Login successful as ${selectedRole}! Redirecting to dashboard...`);
      
      // Role-specific redirects
      if (selectedRole === 'Judge') {
        window.location.href = '/judge-dashboard';
      } else if (selectedRole === 'Lawyer') {
        window.location.href = '/lawyer-dashboard';
      } else {
        window.location.href = '/dashboard';
      }
    } else {
      alert('Invalid credentials for the selected role. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">(company name)</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900">Services</Link>
              <Link href="/public-help" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/signup" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Sign Up
              </Link>
              <Link href="/login" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Role-Based Login
          </h2>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="flex space-x-1 border-b border-gray-200">
              {['Judge', 'Lawyer', 'Witness', 'Party'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    selectedRole === role
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Role Indicator */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-lg">
                  {selectedRole === 'Judge' && '⚖️'}
                  {selectedRole === 'Lawyer' && '👨‍💼'}
                  {selectedRole === 'Witness' && '👤'}
                  {selectedRole === 'Party' && '🏢'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">Login as {selectedRole}</h3>
                <p className="text-sm text-orange-600">
                  {selectedRole === 'Judge' && 'Access judicial dashboard and case management'}
                  {selectedRole === 'Lawyer' && 'Access client cases and legal resources'}
                  {selectedRole === 'Witness' && 'Access witness portal and case information'}
                  {selectedRole === 'Party' && 'Access dispute resolution platform'}
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={`Enter your ${selectedRole.toLowerCase()} email`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                style={{ color: '#000000', backgroundColor: '#ffffff' }}
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
                style={{ color: '#000000', backgroundColor: '#ffffff' }}
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
              Login as {selectedRole}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials for {selectedRole}:</h3>
            <div className="text-xs text-blue-700 space-y-1">
              {selectedRole === 'Judge' && (
                <>
                  <p>Email: judge.eleanor@justicehub.com</p>
                  <p>Password: judge123</p>
                </>
              )}
              {selectedRole === 'Lawyer' && (
                <>
                  <p>Email: lawyer.sarah@justicehub.com</p>
                  <p>Password: lawyer123</p>
                </>
              )}
              {selectedRole === 'Witness' && (
                <>
                  <p>Email: witness.john@justicehub.com</p>
                  <p>Password: witness123</p>
                </>
              )}
              {selectedRole === 'Party' && (
                <>
                  <p>Email: party.techcorp@justicehub.com</p>
                  <p>Password: party123</p>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-600">
                Sign up
              </Link>
            </p>
            <div className="mt-4">
              <Link 
                href="/forgot-password" 
                className="text-orange-500 hover:text-orange-600 text-sm"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}