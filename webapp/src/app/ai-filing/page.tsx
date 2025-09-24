'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AIFiling() {
  const [formData, setFormData] = useState({
    caseTitle: '',
    disputeDescription: '',
    caseType: '',
    urgencyLevel: '',
    documents: null as File[] | null
  })
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const caseTypes = [
    'Mediation',
    'Arbitration',
    'Conciliation', 
    'Negotiation'
  ]

  const urgencyLevels = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ]

  const getAISuggestions = async () => {
    if (!formData.disputeDescription.trim()) return
    
    setIsLoadingSuggestions(true)
    try {
      const response = await fetch('http://localhost:3001/ai/file-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disputeDescription: formData.disputeDescription,
          existingData: {
            caseTitle: formData.caseTitle,
            caseType: formData.caseType
          }
        })
      })
      
      const result = await response.json()
      setAiSuggestions(result)
    } catch (error) {
      console.error('AI suggestion error:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const applySuggestion = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate case submission
    setTimeout(() => {
      const caseId = `ODR-${Date.now()}`
      alert(`Case submitted successfully! Case ID: ${caseId}`)
      
      // Save to history (localStorage for demo)
      const history = JSON.parse(localStorage.getItem('caseHistory') || '[]')
      history.push({
        id: caseId,
        ...formData,
        submittedAt: new Date().toISOString(),
        status: 'Submitted'
      })
      localStorage.setItem('caseHistory', JSON.stringify(history))
      
      // Reset form
      setFormData({
        caseTitle: '',
        disputeDescription: '',
        caseType: '',
        urgencyLevel: '',
        documents: null
      })
      setAiSuggestions(null)
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-500">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">AI Filing Assistant</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">File New Case</h2>
            <p className="text-gray-600">Get AI-powered suggestions as you fill out your case details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Title *
              </label>
              <input
                type="text"
                value={formData.caseTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, caseTitle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter a brief title for your case"
                required
              />
            </div>

            {/* Dispute Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispute Description *
              </label>
              <textarea
                value={formData.disputeDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, disputeDescription: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe your dispute in detail..."
                required
              />
              <button
                type="button"
                onClick={getAISuggestions}
                disabled={isLoadingSuggestions || !formData.disputeDescription.trim()}
                className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isLoadingSuggestions ? '🤖 Getting AI Suggestions...' : '🤖 Get AI Suggestions'}
              </button>
            </div>

            {/* AI Suggestions Card */}
            {aiSuggestions && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🤖 AI Suggestions</h3>
                
                {aiSuggestions.suggestedCaseType && (
                  <div className="mb-4">
                    <p className="text-sm text-blue-700 mb-2">Suggested Case Type:</p>
                    <button
                      type="button"
                      onClick={() => applySuggestion('caseType', aiSuggestions.suggestedCaseType)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Apply: {aiSuggestions.suggestedCaseType}
                    </button>
                  </div>
                )}

                {aiSuggestions.suggestedUrgency && (
                  <div className="mb-4">
                    <p className="text-sm text-blue-700 mb-2">Suggested Urgency:</p>
                    <button
                      type="button"
                      onClick={() => applySuggestion('urgencyLevel', aiSuggestions.suggestedUrgency)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Apply: {aiSuggestions.suggestedUrgency}
                    </button>
                  </div>
                )}

                {aiSuggestions.improvementSuggestions && (
                  <div>
                    <p className="text-sm text-blue-700 mb-2">Suggestions to improve your case:</p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      {aiSuggestions.improvementSuggestions.map((suggestion: string, index: number) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Type *
              </label>
              <select
                value={formData.caseType}
                onChange={(e) => setFormData(prev => ({ ...prev, caseType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select case type</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level *
              </label>
              <select
                value={formData.urgencyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select urgency level</option>
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting Case...' : 'Submit Case'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
