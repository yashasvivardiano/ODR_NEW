'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Case {
  id: string
  parties: string
  status: string
  lastUpdated: string
}

interface Hearing {
  id: string
  parties: string
  dateTime: string
  room: string
}

interface Notification {
  id: string
  message: string
  date: string
}

export default function JudgeDashboard() {
  const [user, setUser] = useState<any>(null)

  const handleViewCase = (caseId: string) => {
    // Redirect to case details with the specific case ID
    window.location.href = `/case-details?id=${caseId}`
  }

  const handleJoinHearing = (hearingId: string) => {
    // Redirect to mediation room for the hearing
    window.location.href = '/mediation-room'
  }
  const [cases, setCases] = useState<Case[]>([
    {
      id: '2024-001',
      parties: 'TechCorp vs. Innovate Solutions',
      status: 'In Review',
      lastUpdated: '2024-07-20'
    },
    {
      id: '2024-002',
      parties: 'Global Logistics vs. Local Distributors',
      status: 'Hearing Scheduled',
      lastUpdated: '2024-07-18'
    },
    {
      id: '2024-003',
      parties: 'RetailChain vs. SupplierCo',
      status: 'Awaiting Evidence',
      lastUpdated: '2024-07-15'
    },
    {
      id: '2024-004',
      parties: 'FinanceGroup vs. InvestmentFirm',
      status: 'Decision Pending',
      lastUpdated: '2024-07-10'
    },
    {
      id: '2024-005',
      parties: 'HealthCareProviders vs. InsuranceCo',
      status: 'Closed',
      lastUpdated: '2024-07-05'
    }
  ])

  const [hearings, setHearings] = useState<Hearing[]>([
    {
      id: '2024-002',
      parties: 'Global Logistics vs. Local Distributors',
      dateTime: 'July 25, 2024, 10:00 AM',
      room: 'Room 3'
    },
    {
      id: '2024-006',
      parties: 'EduTech vs. ContentCreators',
      dateTime: 'July 28, 2024, 2:00 PM',
      room: 'Room 5'
    },
    {
      id: '2024-007',
      parties: 'EnergySolutions vs. GreenTech',
      dateTime: 'August 1, 2024, 11:00 AM',
      room: 'Room 2'
    }
  ])

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'New evidence submitted in Case 2024-003',
      date: '2024-07-22'
    },
    {
      id: '2',
      message: 'Request for review in Case 2024-004',
      date: '2024-07-21'
    },
    {
      id: '3',
      message: 'Hearing scheduled for Case 2024-002',
      date: '2024-07-20'
    }
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    const userRole = localStorage.getItem('userRole')
    
    if (!isLoggedIn || !userData || userRole !== 'judge') {
      window.location.href = '/judge-login'
      return
    }
    
    setUser(JSON.parse(userData))
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Review':
        return 'bg-orange-100 text-orange-800'
      case 'Hearing Scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'Awaiting Evidence':
        return 'bg-yellow-100 text-yellow-800'
      case 'Decision Pending':
        return 'bg-purple-100 text-purple-800'
      case 'Closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/judge-login'
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <Link href="/judge-dashboard" className="flex items-center space-x-3 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg">
                <span className="text-lg">🏠</span>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link href="/cases" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">💼</span>
                <span>Cases</span>
              </Link>
              <Link href="/hearings" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">📅</span>
                <span>Hearings</span>
                <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">12</span>
              </Link>
              <Link href="/notifications" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">🔔</span>
                <span>Notifications</span>
              </Link>
              <Link href="/profile-settings" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">⚙️</span>
                <span>Settings</span>
              </Link>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link href="/help-support" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <span className="text-lg">❓</span>
                <span>Help and Support</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Judge's Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user.name}. Here's an overview of your current workload and upcoming activities.
            </p>
          </div>

          {/* Assigned Cases Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Cases</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties Involved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {caseItem.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {caseItem.parties}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {caseItem.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleViewCase(caseItem.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            View Case
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Hearings Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Hearings</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parties Involved</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hearing Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hearings.map((hearing) => (
                      <tr key={hearing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {hearing.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hearing.parties}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {hearing.dateTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {hearing.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleJoinHearing(hearing.id)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Join Hearing
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
