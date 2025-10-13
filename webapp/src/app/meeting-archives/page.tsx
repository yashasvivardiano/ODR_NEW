'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface ArchivedMeeting {
  id: string
  date: string
  participants: string[]
  caseId: string
  duration: string
  status: 'completed' | 'cancelled'
}

export default function MeetingArchivesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMeeting, setSelectedMeeting] = useState<ArchivedMeeting | null>(null)

  const archivedMeetings: ArchivedMeeting[] = [
    {
      id: '1',
      date: 'July 15, 2024',
      participants: ['Alex Johnson', 'Sarah Lee'],
      caseId: 'Case-2024-001',
      duration: '1 hour 30 minutes',
      status: 'completed'
    },
    {
      id: '2',
      date: 'July 12, 2024',
      participants: ['Michael Chen', 'Emily Davis', 'Judge Eleanor'],
      caseId: 'Case-2024-002',
      duration: '2 hours 15 minutes',
      status: 'completed'
    },
    {
      id: '3',
      date: 'July 10, 2024',
      participants: ['David Martinez', 'Jessica Brown'],
      caseId: 'Case-2024-003',
      duration: '45 minutes',
      status: 'completed'
    },
    {
      id: '4',
      date: 'July 8, 2024',
      participants: ['Robert Wilson', 'Lisa Anderson', 'Judge Michael'],
      caseId: 'Case-2024-004',
      duration: '1 hour 45 minutes',
      status: 'completed'
    },
    {
      id: '5',
      date: 'July 5, 2024',
      participants: ['John Smith', 'Maria Garcia'],
      caseId: 'Case-2024-005',
      duration: '1 hour 20 minutes',
      status: 'completed'
    },
    {
      id: '6',
      date: 'July 3, 2024',
      participants: ['Anna Thompson', 'Chris Davis'],
      caseId: 'Case-2024-006',
      duration: '2 hours 30 minutes',
      status: 'completed'
    }
  ]

  const filteredMeetings = archivedMeetings.filter(meeting => {
    const query = searchQuery.toLowerCase()
    return (
      meeting.caseId.toLowerCase().includes(query) ||
      meeting.participants.some(participant => 
        participant.toLowerCase().includes(query)
      ) ||
      meeting.date.toLowerCase().includes(query)
    )
  })

  const handleViewTranscript = (meeting: ArchivedMeeting) => {
    setSelectedMeeting(meeting)
    // In a real app, this would open a modal or navigate to transcript page
    alert(`Opening transcript for ${meeting.caseId} - ${meeting.date}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/meeting-archives" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeting Archives</h1>
          <p className="text-gray-600">Access and review past virtual hearing sessions.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by case ID, participant, or date"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Meeting Archives Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Case ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMeetings.map((meeting) => (
                  <tr key={meeting.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {meeting.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {meeting.participants.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {meeting.caseId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {meeting.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewTranscript(meeting)}
                        className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                      >
                        View Transcript
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredMeetings.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No meetings found</div>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Meetings</p>
                <p className="text-2xl font-bold text-gray-900">{archivedMeetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {archivedMeetings.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">12h 45m</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unique Participants</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
              Export All Transcripts
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
              Download Meeting Recordings
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
              Generate Summary Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
