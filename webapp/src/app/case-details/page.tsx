'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

interface TimelineEvent {
  id: string
  title: string
  date: string
  icon: string
  description?: string
}

interface CaseData {
  disputeId: string
  status: string
  parties: string
  description: string
  documents: string[]
  upcomingDeadline: string
}

export default function CaseDetailsPage() {
  const searchParams = useSearchParams()
  const disputeId = searchParams.get('id')
  
  const [caseData, setCaseData] = useState<CaseData>({
    disputeId: '#12345',
    status: 'In Mediation',
    parties: 'Emily Carter vs. David Harris',
    description: 'A dispute over a contract for services rendered.',
    documents: ['Contract.pdf', 'Invoice.pdf'],
    upcomingDeadline: 'Mediation Session: July 15, 2024'
  })

  const [isLoading, setIsLoading] = useState(true)

  // Mock data for different disputes
  const disputesData: Record<string, CaseData> = {
    '#12345': {
      disputeId: '#12345',
      status: 'Submitted',
      parties: 'Tech Solutions Inc. vs. Client Corp',
      description: 'Contract dispute over service delivery and payment terms.',
      documents: ['Service_Contract.pdf', 'Payment_Invoice.pdf', 'Email_Correspondence.pdf'],
      upcomingDeadline: 'Initial Review: July 20, 2024'
    },
    '#67890': {
      disputeId: '#67890',
      status: 'In Progress',
      parties: 'Global Logistics Ltd. vs. Supplier Co',
      description: 'Payment dispute for goods received with quality issues.',
      documents: ['Purchase_Order.pdf', 'Quality_Report.pdf', 'Payment_Records.pdf'],
      upcomingDeadline: 'Mediation Session: July 25, 2024'
    },
    '#11223': {
      disputeId: '#11223',
      status: 'Resolved',
      parties: 'Retail Ventures LLC vs. Property Owner',
      description: 'Dispute over lease agreement terms and maintenance responsibilities.',
      documents: ['Lease_Agreement.pdf', 'Maintenance_Records.pdf', 'Resolution_Agreement.pdf'],
      upcomingDeadline: 'Case Closed: June 30, 2024'
    },
    '#44556': {
      disputeId: '#44556',
      status: 'Submitted',
      parties: 'Creative Designs Co. vs. Competitor Inc',
      description: 'Copyright infringement claim regarding logo design.',
      documents: ['Original_Design.pdf', 'Infringement_Evidence.pdf', 'Legal_Notice.pdf'],
      upcomingDeadline: 'Legal Review: July 18, 2024'
    },
    '#77889': {
      disputeId: '#77889',
      status: 'In Progress',
      parties: 'Financial Services Group vs. Borrower',
      description: 'Dispute over loan repayment terms and interest calculations.',
      documents: ['Loan_Agreement.pdf', 'Payment_History.pdf', 'Interest_Calculation.pdf'],
      upcomingDeadline: 'Arbitration Hearing: August 5, 2024'
    }
  }

  useEffect(() => {
    console.log('Dispute ID from URL:', disputeId)
    console.log('Available dispute IDs:', Object.keys(disputesData))
    
    if (disputeId && disputesData[disputeId]) {
      console.log('Loading data for dispute:', disputeId)
      setCaseData(disputesData[disputeId])
      setIsLoading(false)
    } else if (disputeId) {
      console.log('Dispute ID not found in data:', disputeId)
      setIsLoading(false)
    } else {
      console.log('No dispute ID provided')
      setIsLoading(false)
    }
  }, [disputeId])

  const getTimelineEvents = (): TimelineEvent[] => {
    const baseEvents: TimelineEvent[] = [
      {
        id: '1',
        title: 'Dispute Initiated',
        date: 'June 1, 2024',
        icon: '📄',
        description: 'Initial dispute filing submitted'
      }
    ]

    if (caseData.status === 'Submitted') {
      return [
        ...baseEvents,
        {
          id: '2',
          title: 'Under Review',
          date: 'June 10, 2024',
          icon: '🔍',
          description: 'Case is being reviewed by mediators'
        }
      ]
    } else if (caseData.status === 'In Progress') {
      return [
        ...baseEvents,
        {
          id: '2',
          title: 'Mediation Scheduled',
          date: 'June 15, 2024',
          icon: '📅',
          description: 'Mediation session scheduled'
        },
        {
          id: '3',
          title: 'Mediation in Progress',
          date: 'July 1, 2024',
          icon: '⚖️',
          description: 'Active mediation process'
        }
      ]
    } else if (caseData.status === 'Resolved') {
      return [
        ...baseEvents,
        {
          id: '2',
          title: 'Mediation Scheduled',
          date: 'June 15, 2024',
          icon: '📅',
          description: 'Mediation session scheduled'
        },
        {
          id: '3',
          title: 'Mediation Completed',
          date: 'July 15, 2024',
          icon: '✅',
          description: 'Dispute resolved through mediation'
        },
        {
          id: '4',
          title: 'Case Closed',
          date: 'June 30, 2024',
          icon: '🔒',
          description: 'Case officially closed'
        }
      ]
    }

    return baseEvents
  }

  const timelineEvents = getTimelineEvents()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dispute details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="/case-details" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/cases" className="text-orange-600 hover:text-orange-700">
              Disputes
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Dispute Details</span>
          </div>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dispute Details</h1>
          <p className="text-orange-600 text-lg">View all details related to this dispute.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dispute Overview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Dispute Overview</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Dispute ID</span>
                <span className="text-gray-900 font-semibold">{caseData.disputeId}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Status</span>
                <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-orange-100 text-orange-800">
                  {caseData.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Parties Involved</span>
                <span className="text-gray-900 font-semibold">{caseData.parties}</span>
              </div>
              
              <div className="flex justify-between items-start py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Description</span>
                <span className="text-gray-900 font-semibold text-right max-w-xs">{caseData.description}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Documents</span>
                <div className="text-right">
                  {caseData.documents.map((doc, index) => (
                    <div key={index} className="text-gray-900 font-semibold">{doc}</div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Upcoming Deadlines</span>
                <span className="text-gray-900 font-semibold">{caseData.upcomingDeadline}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex items-start">
                    {/* Timeline icon */}
                    <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-2 border-gray-300 rounded-full">
                      <span className="text-lg">{event.icon}</span>
                    </div>
                    
                    {/* Timeline content */}
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      {event.description && (
                        <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <Link 
            href="/mediation-room"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Enter Mediation Room
          </Link>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Download Documents
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Add Note
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Share Case
          </button>
        </div>
      </main>
    </div>
  )
}
