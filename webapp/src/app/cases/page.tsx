'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface Dispute {
  id: string
  opposingParty: string
  status: 'submitted' | 'in-progress' | 'resolved'
  description: string
}

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [disputeSearchQuery, setDisputeSearchQuery] = useState('')

  const disputes: Dispute[] = [
    {
      id: '#12345',
      opposingParty: 'Tech Solutions Inc.',
      status: 'submitted',
      description: 'Contract dispute over service delivery'
    },
    {
      id: '#67890',
      opposingParty: 'Global Logistics Ltd.',
      status: 'in-progress',
      description: 'Payment dispute for goods received'
    },
    {
      id: '#11223',
      opposingParty: 'Retail Ventures LLC',
      status: 'resolved',
      description: 'Dispute over lease agreement terms'
    },
    {
      id: '#44556',
      opposingParty: 'Creative Designs Co.',
      status: 'submitted',
      description: 'Copyright infringement claim'
    },
    {
      id: '#77889',
      opposingParty: 'Financial Services Group',
      status: 'in-progress',
      description: 'Dispute over loan repayment terms'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-orange-100 text-orange-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted'
      case 'in-progress':
        return 'In Progress'
      case 'resolved':
        return 'Resolved'
      default:
        return status
    }
  }

  const filteredDisputes = disputes.filter(dispute => {
    const query = disputeSearchQuery.toLowerCase()
    return (
      dispute.id.toLowerCase().includes(query) ||
      dispute.opposingParty.toLowerCase().includes(query) ||
      dispute.description.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/cases" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Dashboard</h1>
          <p className="text-gray-600">Manage and track all your dispute cases</p>
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
              placeholder="Search disputes"
              value={disputeSearchQuery}
              onChange={(e) => setDisputeSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dispute ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opposing Party
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dispute.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {dispute.opposingParty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(dispute.status)}`}>
                        {getStatusText(dispute.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {dispute.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        href={`/case-details?id=${dispute.id}`}
                        className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* No Results */}
        {filteredDisputes.length === 0 && disputeSearchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No disputes found</div>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">New Dispute</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Submit a new dispute case</p>
            <button 
              onClick={() => window.location.href = '/ai-filing'}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Dispute
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Case Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">View detailed case statistics</p>
            <button 
              onClick={() => alert('Case Analytics feature coming soon! This will show detailed statistics about your cases.')}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              View Analytics
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Case Reports</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Generate case reports and summaries</p>
            <button 
              onClick={() => alert('Case Reports feature coming soon! This will generate comprehensive reports about your cases.')}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
