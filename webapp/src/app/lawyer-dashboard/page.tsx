'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CaseRow {
  id: string
  client: string
  type: string
  status: string
}

interface HearingItem {
  title: string
  caseId: string
  type: string
  date: string
}

export default function LawyerDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const userData = localStorage.getItem('user')
    const role = localStorage.getItem('userRole')

    if (!isLoggedIn || !userData || role !== 'Lawyer') {
      window.location.href = '/login'
      return
    }

    setUser(JSON.parse(userData))
  }, [])

  const cases: CaseRow[] = [
    { id: '#12345', client: 'Sarah Johnson', type: 'Contract Dispute', status: 'In Progress' },
    { id: '#67890', client: 'Michael Chen', type: 'Property Dispute', status: 'Mediation Scheduled' },
    { id: '#11223', client: 'Emily Davis', type: 'Employment Dispute', status: 'Awaiting Response' },
    { id: '#44556', client: 'David Lee', type: 'Family Dispute', status: 'Hearing Scheduled' },
    { id: '#77889', client: 'Jessica Brown', type: 'Business Dispute', status: 'Closed' }
  ]

  const hearings: HearingItem[] = [
    { title: 'Mediation with Michael Chen', caseId: 'Case #67890', type: 'Property Dispute', date: 'July 15, 2024' },
    { title: 'Hearing with David Lee', caseId: 'Case #44556', type: 'Family Dispute', date: 'August 2, 2024' }
  ]

  const badge = (status: string) => {
    const map: Record<string, string> = {
      'In Progress': 'bg-orange-100 text-orange-800',
      'Mediation Scheduled': 'bg-blue-100 text-blue-800',
      'Awaiting Response': 'bg-yellow-100 text-yellow-800',
      'Hearing Scheduled': 'bg-purple-100 text-purple-800',
      'Closed': 'bg-green-100 text-green-800'
    }
    return map[status] ?? 'bg-gray-100 text-gray-800'
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
              <h1 className="text-xl font-semibold text-gray-800">LegalEase</h1>
              <span className="ml-2 text-sm text-gray-500">Lawyer</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome back, {user.name}</span>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/login'
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
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-6 space-y-2">
            <Link href="/lawyer-dashboard" className="flex items-center space-x-3 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg">
              <span className="text-lg">🏠</span>
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link href="/cases" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="text-lg">📁</span>
              <span>Cases</span>
            </Link>
            <Link href="/hearings" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="text-lg">📅</span>
              <span>Hearings</span>
            </Link>
            <Link href="/messages" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="text-lg">👥</span>
              <span>Clients</span>
            </Link>
            <Link href="/resources" className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <span className="text-lg">📚</span>
              <span>Resources</span>
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Lawyer Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back, {user.name}</p>
          </div>

          {/* Active Cases */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Cases</h2>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dispute Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cases.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.client}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge(row.status)}`}>{row.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Upcoming Hearings & Deadlines */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Hearings & Deadlines</h2>
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              {hearings.map((h) => (
                <div key={h.title} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm text-gray-900">{h.title}</p>
                    <p className="text-xs text-gray-500">{h.caseId} - {h.type}</p>
                  </div>
                  <span className="text-xs text-gray-500">{h.date}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Client Communications */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Client Communications</h2>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Case #12345 - Contract Dispute</p>
                  <p className="text-xs text-gray-500">New message from Sarah Johnson</p>
                </div>
                <button className="text-orange-600 text-sm">View</button>
              </div>
            </div>
          </section>

          {/* Quick Access */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📄</span>
                  <div>
                    <p className="text-sm text-gray-900">Case Documents</p>
                  </div>
                </div>
                <button className="text-orange-600 text-sm">View</button>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">📚</span>
                  <div>
                    <p className="text-sm text-gray-900">Legal Resources</p>
                  </div>
                </div>
                <Link href="/resources" className="text-orange-600 text-sm">Browse</Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
