'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const features = [
    {
      title: 'AI Filing Assistant',
      description: 'Get intelligent suggestions for case filing',
      icon: '🤖',
      href: '/ai-filing',
      color: 'bg-blue-500'
    },
    {
      title: 'Court Hearing AI',
      description: 'Process hearing recordings with AI analysis',
      icon: '⚖️',
      href: '/hearing-ai',
      color: 'bg-purple-500'
    },
    {
      title: 'Case History',
      description: 'View all your filed cases and activities',
      icon: '📋',
      href: '/history',
      color: 'bg-green-500'
    },
    {
      title: 'Virtual Hearings',
      description: 'Join scheduled video hearings',
      icon: '🎥',
      href: '/hearings',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-indigo-600">ODR Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button 
                onClick={() => {
                  localStorage.removeItem('user')
                  window.location.href = '/'
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">AI-Powered Legal Tools</h2>
          <p className="text-gray-600 mt-2">Choose from our suite of AI-enhanced legal services</p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Cases</h3>
            <p className="text-3xl font-bold text-indigo-600">3</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Suggestions Used</h3>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hearings Scheduled</h3>
            <p className="text-3xl font-bold text-purple-600">2</p>
          </div>
        </div>
      </main>
    </div>
  )
}
