'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New message from Alex Johnson',
      caseNumber: 'Case #123456',
      time: '2 hours ago',
      type: 'message',
      read: false
    },
    {
      id: 2,
      title: 'Hearing scheduled for Case #789012',
      caseNumber: 'Case #789012',
      time: 'Yesterday',
      type: 'hearing',
      read: false
    },
    {
      id: 3,
      title: 'Document received for Case #345678',
      caseNumber: 'Case #345678',
      time: '2 days ago',
      type: 'document',
      read: true
    },
    {
      id: 4,
      title: 'Case #901234 is now closed',
      caseNumber: 'Case #901234',
      time: '3 days ago',
      type: 'case-closed',
      read: true
    },
    {
      id: 5,
      title: 'Reminder: Hearing for Case #567890 is tomorrow',
      caseNumber: 'Case #567890',
      time: '4 days ago',
      type: 'reminder',
      read: true
    },
    {
      id: 6,
      title: 'New message from Sarah Williams',
      caseNumber: 'Case #234567',
      time: '5 days ago',
      type: 'message',
      read: true
    },
    {
      id: 7,
      title: 'Document received for Case #890123',
      caseNumber: 'Case #890123',
      time: '6 days ago',
      type: 'document',
      read: true
    },
    {
      id: 8,
      title: 'Case #456789 is now closed',
      caseNumber: 'Case #456789',
      time: '1 week ago',
      type: 'case-closed',
      read: true
    },
    {
      id: 9,
      title: 'Hearing scheduled for Case #123456',
      caseNumber: 'Case #123456',
      time: '2 weeks ago',
      type: 'hearing',
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
      case 'message': return '✉️'
      case 'hearing': return '📅'
      case 'document': return '📄'
      case 'case-closed': return '✅'
      case 'reminder': return '🔔'
      default: return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'hearing': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'document': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'case-closed': return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'reminder': return 'bg-orange-100 text-orange-600 border-orange-200'
      default: return 'bg-orange-100 text-orange-600 border-orange-200'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read
    if (activeTab === 'archived') return notification.read
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navigation 
        currentPage="/notifications" 
        unreadCount={notifications.filter(n => !n.read).length} 
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Notifications</h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 text-lg font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'text-gray-800 border-b-2 border-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`pb-3 text-lg font-medium transition-colors ${
                activeTab === 'unread' 
                  ? 'text-gray-800 border-b-2 border-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`pb-3 text-lg font-medium transition-colors ${
                activeTab === 'archived' 
                  ? 'text-gray-800 border-b-2 border-gray-800' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Archived
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div 
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              className={`bg-white rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl border-2 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'} mb-1`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {notification.caseNumber}
                      </p>
                    </div>
                    <span className="text-sm text-orange-600 font-medium ml-4 flex-shrink-0">
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
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
