'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface NavigationProps {
  currentPage?: string
  unreadCount?: number
}

export default function Navigation({ currentPage = '', unreadCount = 0 }: NavigationProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (!isLoggedIn || !userData) {
      window.location.href = '/login'
      return
    }
    
    setUser(JSON.parse(userData))
  }, [])

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/cases', label: 'Cases' },
    { href: '/hearings', label: 'Hearings' },
    { href: '/documents', label: 'Documents' },
    { href: '/messages', label: 'Messages' },
    { href: '/resources', label: 'Resources' }
  ]

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-lg font-bold text-gray-900">(company name)</span>
          </div>
          
          {/* Navigation Links and User Actions - Right Side */}
          <div className="flex items-center space-x-8">
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                    currentPage === item.href 
                      ? 'text-gray-900 bg-orange-100 shadow-orange-200 shadow-md' 
                      : 'text-gray-900 hover:text-orange-600 hover:bg-orange-50 hover:shadow-orange-200 hover:shadow-md'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Notifications with unread count */}
        <button
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer relative ${
            currentPage === '/notifications'
              ? 'bg-orange-200 shadow-orange-300 shadow-md scale-105'
              : 'bg-gray-200 hover:bg-orange-200 hover:shadow-orange-300 hover:shadow-md hover:scale-105'
          }`}
          onClick={() => window.location.href = '/notifications'}
          title="Notifications"
          suppressHydrationWarning
        >
                <span className="text-gray-700 text-lg">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Help/Support */}
              <button 
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  currentPage === '/help-support'
                    ? 'bg-orange-200 shadow-orange-300 shadow-md scale-105'
                    : 'bg-gray-200 hover:bg-orange-200 hover:shadow-orange-300 hover:shadow-md hover:scale-105'
                }`}
                onClick={() => window.location.href = '/help-support'}
                title="Help & Support"
                suppressHydrationWarning
              >
                <span className="text-gray-700 text-lg">?</span>
              </button>
              
              {/* Profile Picture */}
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  currentPage === '/profile-settings'
                    ? 'bg-orange-200 shadow-orange-300 shadow-md scale-105'
                    : 'bg-purple-200 hover:bg-orange-200 hover:shadow-orange-300 hover:shadow-md hover:scale-105'
                }`}
                onClick={() => window.location.href = '/profile-settings'}
                title="Profile Settings"
                suppressHydrationWarning
              >
                <span className="text-gray-700 text-lg">⚖️</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation - Show on small screens */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <nav className="flex space-x-4 overflow-x-auto px-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className={`font-medium transition-all duration-200 px-3 py-2 rounded-lg whitespace-nowrap ${
                  currentPage === item.href 
                    ? 'text-gray-900 bg-orange-100 shadow-orange-200 shadow-md' 
                    : 'text-gray-900 hover:text-orange-600 hover:bg-orange-50 hover:shadow-orange-200 hover:shadow-md'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
