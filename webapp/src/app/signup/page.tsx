'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Role = 'Judge' | 'Lawyer' | 'Witness' | 'Party';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone?: string;
  barNumber?: string; // For lawyers
  specialization?: string; // For lawyers
  caseNumber?: string; // For witnesses/parties
  organization?: string; // For parties
}

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState<Role>('Judge');
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    barNumber: '',
    specialization: '',
    caseNumber: '',
    organization: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    
    // Create user object
    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: selectedRole,
      barNumber: formData.barNumber,
      specialization: formData.specialization,
      caseNumber: formData.caseNumber,
      organization: formData.organization,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('Signup successful:', userData);
    alert('Account created successfully! Redirecting to dashboard...');
    
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  const renderRoleSpecificFields = () => {
    switch (selectedRole) {
      case 'Lawyer':
        return (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Bar Registration Number
              </label>
              <input
                type="text"
                name="barNumber"
                value={formData.barNumber}
                onChange={handleInputChange}
                placeholder="Enter your bar registration number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Specialization
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Select specialization</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Civil Law">Civil Law</option>
                <option value="Corporate Law">Corporate Law</option>
                <option value="Family Law">Family Law</option>
                <option value="Property Law">Property Law</option>
                <option value="Constitutional Law">Constitutional Law</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </>
        );
      case 'Witness':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Case Number (if applicable)
            </label>
            <input
              type="text"
              name="caseNumber"
              value={formData.caseNumber}
              onChange={handleInputChange}
              placeholder="Enter case number if you're a witness"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        );
      case 'Party':
        return (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Organization (if applicable)
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              placeholder="Enter organization name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

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
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Role-Based Registration
          </h2>

          {/* Role Selection */}
          <div className="mb-8">
            <div className="flex space-x-1 border-b border-gray-200">
              {(['Judge', 'Lawyer', 'Witness', 'Party'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    selectedRole === role
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Role-specific fields */}
            {renderRoleSpecificFields()}

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
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}