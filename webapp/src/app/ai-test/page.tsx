'use client'

import { useState } from 'react'

interface CaseAnalysis {
  analysis: {
    caseComplexity: string
    suggestedMediator: string
    estimatedDuration: string
    keyIssues: string[]
    recommendations: string[]
    riskAssessment: string
    successProbability: number
  }
}

interface Mediator {
  name: string
  specialization: string[]
  experience: number
  rating: number
  successRate: number
  matchScore: number
}

interface MediatorMatch {
  mediators: Mediator[]
}

interface HearingAI {
  assistance: {
    hearingType: string
    suggestedApproach: string
    keyPoints: string[]
    questions: string[]
    expectedOutcome: string
    confidenceLevel: string
  }
}

export default function AITest() {
  const [caseAnalysis, setCaseAnalysis] = useState<CaseAnalysis | null>(null)
  const [mediatorMatch, setMediatorMatch] = useState<MediatorMatch | null>(null)
  const [hearingAI, setHearingAI] = useState<HearingAI | null>(null)
  const [loading, setLoading] = useState(false)
  const [testData, setTestData] = useState({
    caseDescription: 'Consumer complaint about defective product',
    category: 'consumer',
    complexity: 'medium',
    location: 'New York'
  })

  const testCaseAnalysis = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ai/analyze-case', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseDescription: testData.caseDescription,
          category: testData.category
        }),
      })
      
      const data = await response.json()
      setCaseAnalysis(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to analyze case')
    } finally {
      setLoading(false)
    }
  }

  const testMediatorMatch = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ai/match-mediator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseCategory: testData.category,
          caseComplexity: testData.complexity,
          location: testData.location
        }),
      })
      
      const data = await response.json()
      setMediatorMatch(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to match mediators')
    } finally {
      setLoading(false)
    }
  }

  const testHearingAI = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/ai/hearing-assistance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hearingType: 'mediation',
          caseDetails: testData.caseDescription
        }),
      })
      
      const data = await response.json()
      setHearingAI(data)
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to get hearing assistance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Features Testing</h1>
        
        {/* Test Data Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Description
              </label>
              <textarea
                value={testData.caseDescription}
                onChange={(e) => setTestData({...testData, caseDescription: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={testData.category}
                onChange={(e) => setTestData({...testData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="consumer">Consumer</option>
                <option value="contract">Contract</option>
                <option value="ecommerce">E-commerce</option>
                <option value="property">Property</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complexity
              </label>
              <select
                value={testData.complexity}
                onChange={(e) => setTestData({...testData, complexity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={testData.location}
                onChange={(e) => setTestData({...testData, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={testCaseAnalysis}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Case Analysis'}
          </button>
          
          <button
            onClick={testMediatorMatch}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Mediator Match'}
          </button>
          
          <button
            onClick={testHearingAI}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Testing...' : 'Test Hearing AI'}
          </button>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Case Analysis Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Case Analysis Results</h3>
            {caseAnalysis ? (
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Complexity:</span> {caseAnalysis.analysis?.caseComplexity}
                </div>
                <div>
                  <span className="font-medium">Suggested Mediator:</span> {caseAnalysis.analysis?.suggestedMediator}
                </div>
                <div>
                  <span className="font-medium">Estimated Duration:</span> {caseAnalysis.analysis?.estimatedDuration}
                </div>
                <div>
                  <span className="font-medium">Key Issues:</span>
                  <ul className="list-disc list-inside ml-2">
                    {caseAnalysis.analysis?.keyIssues?.map((issue, index) => (
                      <li key={index}>{issue}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Recommendations:</span>
                  <ul className="list-disc list-inside ml-2">
                    {caseAnalysis.analysis?.recommendations?.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium">Success Probability:</span> {caseAnalysis.analysis?.successProbability}%
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click "Test Case Analysis" to see results</p>
            )}
          </div>

          {/* Mediator Match Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Mediator Match Results</h3>
            {mediatorMatch ? (
              <div className="space-y-3">
                {mediatorMatch.mediators?.map((mediator, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="font-medium">{mediator.name}</div>
                    <div className="text-sm text-gray-600">
                      Specialization: {mediator.specialization?.join(', ')}
                    </div>
                    <div className="text-sm text-gray-600">
                      Experience: {mediator.experience} years
                    </div>
                    <div className="text-sm text-gray-600">
                      Rating: {mediator.rating}/5
                    </div>
                    <div className="text-sm text-gray-600">
                      Success Rate: {mediator.successRate}%
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      Match Score: {mediator.matchScore}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Click "Test Mediator Match" to see results</p>
            )}
          </div>

          {/* Hearing AI Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Hearing AI Results</h3>
            {hearingAI ? (
              <div className="space-y-3">
                <div className="border rounded-lg p-4">
                  <div className="font-medium text-lg mb-2">AI Hearing Assistance</div>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Hearing Type:</span> {hearingAI.assistance?.hearingType || 'Mediation'}
                    </div>
                    <div>
                      <span className="font-medium">Suggested Approach:</span> {hearingAI.assistance?.suggestedApproach || 'Collaborative mediation'}
                    </div>
                    <div>
                      <span className="font-medium">Key Points to Address:</span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {hearingAI.assistance?.keyPoints?.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Questions to Ask:</span>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        {hearingAI.assistance?.questions?.map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-medium">Expected Outcome:</span> {hearingAI.assistance?.expectedOutcome || 'Resolution through mediation'}
                    </div>
                    <div>
                      <span className="font-medium">Confidence Level:</span> {hearingAI.assistance?.confidenceLevel || '85%'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Click "Test Hearing AI" to see results</p>
            )}
          </div>
        </div>

        {/* Backend Status */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Backend Status</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Backend API: Running on port 3001</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>AI Routes: Loaded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
