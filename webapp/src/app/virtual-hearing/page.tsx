'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function VirtualHearingRoom() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isCallActive, setIsCallActive] = useState(true)
  const [transcription, setTranscription] = useState('')
  const [caseProgress, setCaseProgress] = useState({
    partyA: 65,
    partyB: 35,
    currentChange: 10
  })

  const participants = [
    { id: 1, name: 'Sarah Johnson', role: 'Plaintiff', isActive: false },
    { id: 2, name: 'Michael Chen', role: 'Defendant', isActive: true },
    { id: 3, name: 'Judge Eleanor', role: 'Judge', isActive: false }
  ]

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleVideoToggle = () => {
    setIsVideoOn(!isVideoOn)
  }

  const handleEndCall = () => {
    setIsCallActive(false)
  }

  const simulateTranscription = () => {
    const sampleTexts = [
      "Judge: Let's begin with opening statements.",
      "Plaintiff: Thank you, Your Honor. We believe the evidence clearly shows...",
      "Defendant: We respectfully disagree with the plaintiff's interpretation...",
      "Judge: I understand both positions. Let's proceed with the evidence review."
    ]
    
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < sampleTexts.length) {
        setTranscription(prev => prev + sampleTexts[currentIndex] + '\n\n')
        currentIndex++
      } else {
        clearInterval(interval)
      }
    }, 3000)
  }

  useEffect(() => {
    if (isCallActive) {
      simulateTranscription()
    }
  }, [isCallActive])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">(company name)</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/cases" className="text-gray-600 hover:text-gray-900">Cases</Link>
              <Link href="/hearings" className="text-gray-600 hover:text-gray-900">Hearings</Link>
              <Link href="/documents" className="text-gray-600 hover:text-gray-900">Documents</Link>
              <Link href="/settings" className="text-gray-600 hover:text-gray-900">Settings</Link>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm">👤</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Main Content - Left Side */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Virtual Hearing Room</h1>
          </div>

          {/* Video Conference Area */}
          <div className="bg-orange-100 rounded-2xl p-8 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              {/* Video Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {participants.map((participant, index) => (
                  <div key={participant.id} className={`relative bg-gray-200 rounded-lg h-32 flex items-center justify-center ${
                    participant.isActive ? 'ring-4 ring-green-400' : ''
                  }`}>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="text-xs text-gray-600">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                    {participant.isActive && (
                      <div className="absolute top-2 right-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Call Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleEndCall}
                  className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="End Call"
                >
                  📞
                </button>
                <button
                  onClick={handleMuteToggle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isMuted ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  🎤
                </button>
                <button
                  onClick={handleVideoToggle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isVideoOn ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                  title={isVideoOn ? 'Turn off video' : 'Turn on video'}
                >
                  📹
                </button>
              </div>
            </div>
          </div>

          {/* Meeting Transcription */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Meeting Transcription</h2>
            <p className="text-sm text-gray-600 mb-4">
              The meeting transcription will appear here in real-time. You can save the transcription after the meeting concludes.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-48">
              {transcription ? (
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {transcription}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p className="font-semibold">No transcription available</p>
                  <p className="text-sm">The transcription will be generated during the meeting. Please wait for the meeting to start.</p>
                </div>
              )}
            </div>
            {transcription && (
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                  Save Transcription
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Case Progression */}
        <div className="w-80 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Case Progression</h2>
          
          {/* Probability Display */}
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">75%</div>
            <div className="text-sm text-gray-600">Current +{caseProgress.currentChange}%</div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Party A</span>
                <span>{caseProgress.partyA}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${caseProgress.partyA}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Party B</span>
                <span>{caseProgress.partyB}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${caseProgress.partyB}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Case ID:</span>
                <span className="font-medium">#2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">45 min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">In Progress</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm">
                Share Screen
              </button>
              <button className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm">
                Record Meeting
              </button>
              <button className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm">
                Break Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
