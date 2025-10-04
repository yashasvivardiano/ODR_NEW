'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Case Assignment',
      message: 'You have been assigned to case #2024-001',
      time: '2 hours ago',
      type: 'case',
      read: false
    },
    {
      id: 2,
      title: 'Hearing Reminder',
      message: 'Your hearing for case #2024-002 is scheduled for tomorrow at 10:00 AM',
      time: '1 day ago',
      type: 'hearing',
      read: false
    },
    {
      id: 3,
      title: 'Document Uploaded',
      message: 'New evidence document has been uploaded to case #2024-001',
      time: '3 days ago',
      type: 'document',
      read: true
    },
    {
      id: 4,
      title: 'Profile Update Required',
      message: 'Please update your professional details in your profile',
      time: '1 week ago',
      type: 'profile',
      read: true
    }
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    
    if (!isLoggedIn || !userData) {
      window.location.href = '/login'
      return
    }
    
    setUser(JSON.parse(userData))
  }, [])

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    )
  }

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case': return '⚖️'
      case 'hearing': return '🎥'
      case 'document': return '📄'
      case 'profile': return '👤'
      default: return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'case': return 'bg-blue-100 text-blue-800'
      case 'hearing': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-green-100 text-green-800'
      case 'profile': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation 
        currentPage="/notifications" 
        unreadCount={notifications.filter(n => !n.read).length} 
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Notifications</h1>
          <button 
            onClick={markAllAsRead}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`bg-white rounded-lg p-6 shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                notification.read ? 'border-gray-200' : 'border-orange-500'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${notification.read ? 'text-gray-600' : 'text-black'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                  <p className={`mt-2 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {notification.message}
                  </p>
                  {!notification.read && (
                    <div className="mt-3">
                      <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </main>
    </div>
  )
}
