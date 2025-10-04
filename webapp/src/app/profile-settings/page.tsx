'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function ProfileSettings() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    
    // Professional Details
    specialization: '',
    licenseNumber: '',
    bio: '',
    
    // Security
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    
    // Notifications
    emailNotifications: false,
    smsNotifications: false,
    inAppNotifications: false
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData(prev => ({
        ...prev,
        email: parsedUser.email || '',
        fullName: parsedUser.name || ''
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Profile updated:', formData)
    alert('Profile settings saved successfully!')
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <Navigation currentPage="/profile-settings" unreadCount={0} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-black mb-8">Profile Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your specialization"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">License Number</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter your license number"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-black mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Security</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold text-black mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailNotifications" className="ml-2 block text-sm text-black">
                  Email Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  name="smsNotifications"
                  checked={formData.smsNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-black">
                  SMS Notifications
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inAppNotifications"
                  name="inAppNotifications"
                  checked={formData.inAppNotifications}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="inAppNotifications" className="ml-2 block text-sm text-black">
                  In-App Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
