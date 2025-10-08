'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'

interface ArchivedMeeting {
  id: string
  date: string
  participants: string[]
  caseId: string
  duration: string
  status: 'completed' | 'cancelled'
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('meeting-archives')

  const handleViewTranscript = (meeting: ArchivedMeeting) => {
    alert(`Viewing transcript for ${meeting.caseId}\n\nDate: ${meeting.date}\nParticipants: ${meeting.participants.join(', ')}\nDuration: ${meeting.duration}\n\nTranscript feature coming soon! This will show the full meeting transcript with timestamps and speaker identification.`)
  }

  const handleUploadDocument = () => {
    alert('Upload Document feature coming soon!\n\nThis will allow you to:\n• Upload case-related documents (PDF, DOC, images)\n• Add document descriptions and tags\n• Organize documents by case\n• Set document permissions and access levels')
  }

  const handleBrowseTemplates = () => {
    alert('Document Templates feature coming soon!\n\nThis will provide access to:\n• Legal document templates\n• Contract templates\n• Form templates\n• Customizable document formats')
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/documents" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Documents</h1>
          <p className="text-gray-600">Access and manage all your case documents and meeting archives.</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('meeting-archives')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'meeting-archives'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Meeting Archives
            </button>
            <button
              onClick={() => setActiveTab('case-documents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'case-documents'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Case Documents
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === 'templates'
                  ? 'border-orange-500 text-orange-600 bg-orange-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
          </div>
        </div>

        {/* Meeting Archives Tab */}
        {activeTab === 'meeting-archives' && (
          <div>
            {/* Search Bar */}
            <div className="mb-6">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meeting.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{meeting.participants.join(', ')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meeting.caseId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{meeting.duration}</td>
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
          </div>
        )}

        {/* Case Documents Tab */}
        {activeTab === 'case-documents' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Documents</h2>
            <p className="text-gray-600">Upload and manage case-related documents.</p>
            <div className="mt-6">
              <button 
                onClick={handleUploadDocument}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Upload Document
              </button>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Templates</h2>
            <p className="text-gray-600">Access pre-built document templates for your cases.</p>
            <div className="mt-6">
              <button 
                onClick={handleBrowseTemplates}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Browse Templates
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
