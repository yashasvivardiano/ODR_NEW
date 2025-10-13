'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Hearing {
  id: string
  caseId: string
  title: string
  date: string
  time: string
  status: 'upcoming' | 'in-progress' | 'completed'
  participants: string[]
  room: string
}

export default function HearingsPage() {
  const [selectedHearing, setSelectedHearing] = useState<Hearing | null>(null)

  const hearings: Hearing[] = [
    {
      id: '1',
      caseId: '#2024-001',
      title: 'TechCorp vs. Innovate Solutions',
      date: '2024-07-25',
      time: '10:00 AM',
      status: 'upcoming',
      participants: ['Sarah Johnson', 'Michael Chen', 'Judge Eleanor'],
      room: 'Room 3'
    },
    {
      id: '2',
      caseId: '#2024-002',
      title: 'Global Logistics vs. Local Distributors',
      date: '2024-07-28',
      time: '2:00 PM',
      status: 'upcoming',
      participants: ['David Martinez', 'Emily Davis', 'Judge Michael'],
      room: 'Room 5'
    },
    {
      id: '3',
      caseId: '#2024-003',
      title: 'RetailChain vs. SupplierCo',
      date: '2024-07-20',
      time: '11:00 AM',
      status: 'completed',
      participants: ['Jessica Brown', 'Robert Wilson', 'Judge Sarah'],
      room: 'Room 2'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return status
    }
  }

  const handleJoinHearing = (hearing: Hearing) => {
    if (hearing.status === 'upcoming') {
      // Redirect to cases to access mediation room through case details
      window.location.href = '/cases'
    }
  }

  const handleScheduleHearing = () => {
    alert('Schedule Hearing feature coming soon! This will allow you to schedule new hearings for your cases.')
  }

  const handleViewRecords = () => {
    alert('Hearing Records feature coming soon! This will show past hearing transcripts and recordings.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/hearings" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hearings</h1>
          <p className="text-gray-600">Manage and join your scheduled hearings</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Schedule Hearing</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Schedule a new hearing for your case</p>
            <button 
              onClick={handleScheduleHearing}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Schedule Now
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">🎥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Virtual Hearing</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Join or start a virtual hearing room</p>
            <Link 
              href="/cases"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors inline-block text-center"
            >
              View Cases
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hearing Records</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">View past hearing transcripts and recordings</p>
            <button 
              onClick={handleViewRecords}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              View Records
            </button>
          </div>
        </div>

        {/* Hearings List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Scheduled Hearings</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {hearings.map((hearing) => (
              <div key={hearing.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{hearing.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(hearing.status)}`}>
                        {getStatusText(hearing.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Case ID:</span> {hearing.caseId}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {hearing.date}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {hearing.time}
                      </div>
                      <div>
                        <span className="font-medium">Room:</span> {hearing.room}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">Participants:</span> {hearing.participants.join(', ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {hearing.status === 'upcoming' && (
                      <button
                        onClick={() => handleJoinHearing(hearing)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                      >
                        Join Hearing
                      </button>
                    )}
                    {hearing.status === 'completed' && (
                      <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                        View Transcript
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Hearings Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Hearings</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <p className="text-sm text-gray-600">Hearings scheduled for today</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">5</div>
            <p className="text-sm text-gray-600">Total hearings this week</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed</h3>
            <div className="text-3xl font-bold text-gray-600 mb-2">12</div>
            <p className="text-sm text-gray-600">Hearings completed this month</p>
          </div>
        </div>
      </main>
    </div>
  )
}
